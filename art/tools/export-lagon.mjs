// LE LAGON, FOND DE L'APPLICATION (lot « Lagon en fond d'exercices », docs/SPEC.md, section 11).
// Le fond n'est pas dessiné par l'atelier : c'est le début du panorama de la maquette du récif vivant
// (art/recif-vivant/index.html), des images qu'on extrait telles quelles. La maquette n'est jamais modifiée :
// on lit ses données (l'objet `A` en tête de son script) et on fabrique :
//   app/assets/art/lagon@<1|2>x.webp       le fond : le panorama de x = 0 à 2 838,4 (la largeur que montre
//                                           un écran 1280 × 800 à la hauteur du panorama), avec, immobiles,
//                                           le bord de la gorgone violette et de l'anémone blanche, posés
//                                           comme la maquette les pose (pied, plan arrière ou avant) ;
//                                           WebP avec perte (l'image d'origine l'est déjà)
//   app/assets/art/lagon-vie@<1|2>x.webp   ce qui bouge : les 3 algues, les 22 poissons en silhouette, les
//                                           6 textures de faisceau (le procédé de la maquette, makeShaft)
//   app/assets/art/atlas.json               leurs entrées (planches « lagon » et « lagon-vie »), avec ce dont
//                                           le moteur a besoin (relief du récif `top`, sens de la tête…)
// puis vérifie que l'extraction est reproductible (seconde extraction dans une page neuve, empreintes des
// pixels et des fichiers identiques).
//
//   node tools/export-lagon.mjs              (aussi appelé par node tools/export-app.mjs)
//   node tools/export-lagon.mjs --no-check
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = resolve(new URL(".", import.meta.url).pathname, "..");
export const MAQUETTE = join(HERE, "recif-vivant/index.html");
// le cadrage : la scène logique de 1280 × 800 à la hauteur du panorama (1 774 px) en montre 2 838,4 px
export const SCENE = { W: 1280, H: 800 };
const FOND_QUALITE = 0.9, VIE_QUALITE = 0.9; // avec perte, comme les images d'origine (sans perte : 572 Ko au lieu de ~150 en @2x, pour rien)
const EDGE_ALPHA = 24; // même seuil que l'export de l'atelier (src/hosts/export-app.ts)

// les données de la maquette, lues sans l'exécuter : `const A = {...};` est une ligne de JSON
export function readMaquette(path = MAQUETTE) {
  const html = readFileSync(path, "utf8"), m = html.match(/^const A = (\{.*\});$/m);
  if (!m) throw new Error(`export-lagon : données « A » introuvables dans ${path}`);
  const A = JSON.parse(m[1]);
  // le sens de la tête de chaque poisson et la composition des bancs : repris du script de la maquette
  const grab = (name) => { const r = html.match(new RegExp(`^const ${name} = ([\\s\\S]*?);\\n`, "m")); if (!r) throw new Error(`export-lagon : ${name} introuvable`); return r[1]; };
  const HEAD = Function(`return (${grab("HEAD")})`)(), SOLOS = Function(`return (${grab("SOLOS")})`)(), SCHOOLS = Function(`return (${grab("SCHOOLS")})`)();
  return { A, HEAD, SOLOS, SCHOOLS, empreinte: createHash("sha256").update(html).digest("hex").slice(0, 12) };
}

// ce qui tourne dans la page (Chromium) : composition et encodage
const PAGE = async ({ A, W, H, fondQ, vieQ, EDGE, sceneW, sceneH }) => {
  const load = (src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error("image illisible")); i.src = src; });
  const b64 = (blob) => new Promise((ok) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
  // empreinte des pixels (FNV-1a sur 2 × 32 bits ; la page n'a pas crypto.subtle hors contexte sécurisé)
  const hash = async (c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let a = 0x811c9dc5, b = 0x01000193; for (let i = 0; i < d.length; i++) { a = Math.imul(a ^ d[i], 16777619); b = Math.imul(b ^ d[i] ^ (i & 255), 2246822519); } return (a >>> 0).toString(16).padStart(8, "0") + (b >>> 0).toString(16).padStart(8, "0"); };
  const PH = A.H, VUE = (PH * sceneW) / sceneH, k = H / PH; // px de la planche par px du panorama
  // 1. le fond, composé à la résolution du panorama puis réduit une fois
  const pan = new OffscreenCanvas(Math.ceil(VUE), PH), g = pan.getContext("2d");
  const tiles = await Promise.all(A.tiles.map((t) => (t.x < VUE ? load(t.src) : null)));
  A.tiles.forEach((t, i) => { if (tiles[i]) g.drawImage(tiles[i], t.x, 0); });
  // flore du récif posée par son pied (mêmes formules que la maquette : decorItems), immobile
  const decor = A.decorItems.map((d) => { const sp = A.decorSprites[d.key], s = d.h / sp.by, flip = d.flip ? -1 : 1, bx = flip < 0 ? sp.w - sp.bx : sp.bx; return { ...d, sp, flip, w: sp.w * s, hh: sp.h * s, left: d.x - bx * s, top: d.y - sp.by * s }; }).filter((d) => d.left < VUE && d.left + d.w > 0);
  const put = async (d) => { const im = await load(d.sp.src); g.save(); if (d.flip < 0) { g.translate(d.left + d.w, d.top); g.scale(-1, 1); g.drawImage(im, 0, 0, d.w, d.hh); } else g.drawImage(im, d.left, d.top, d.w, d.hh); g.restore(); };
  for (const d of decor.filter((d) => d.layer === "back")) await put(d);
  // le premier plan de la maquette : les mêmes pixels que le fond, découpés par un masque, posés après le plan arrière
  for (const f of A.front.filter((f) => f.x < VUE)) {
    const mask = await load(f.mask), c = new OffscreenCanvas(f.w, PH - f.y), gc = c.getContext("2d");
    gc.drawImage(tiles[f.tile], 0, f.y, f.w, PH - f.y, 0, 0, f.w, PH - f.y); gc.globalCompositeOperation = "destination-in"; gc.drawImage(mask, 0, 0, f.w, PH - f.y);
    g.drawImage(c, f.x, f.y);
  }
  for (const d of decor.filter((d) => d.layer === "front")) await put(d);
  // les 6 premières colonnes du panorama sont abîmées (un liseré sombre) : la maquette ne les montre jamais (son
  // programme de surface lit au plus tôt la colonne 6, « max(wx + dx, 6.0) ») ; on fait de même : colonne 6 recopiée
  for (let x = 0; x < 6; x++) g.drawImage(pan, 6, 0, 1, PH, x, 0, 1, PH);
  const fond = new OffscreenCanvas(W, H), gf = fond.getContext("2d");
  gf.imageSmoothingQuality = "high"; gf.drawImage(pan, 0, 0, VUE, PH, 0, 0, W, H);
  // 2. ce qui bouge : chaque image à sa taille dans la planche (algues et poissons réduits de k), avec la
  // trace des pixels visibles sur les bords de l'image source (contrôle tests/unit/bords.test.mjs)
  const items = [];
  const edges = (c) => { const x = c.getContext("2d"), w = c.width, h = c.height; return [x.getImageData(0, 0, w, 1), x.getImageData(w - 1, 0, 1, h), x.getImageData(0, h - 1, w, 1), x.getImageData(0, 0, 1, h)].map((d) => { let n = 0; for (let i = 3; i < d.data.length; i += 4) if (d.data[i] >= EDGE) n++; return n; }); };
  // (les bords sont relevés sur l'image source, à sa taille : une image coupée l'est déjà dans la maquette ;
  // l'image rangée a 1 px de marge transparente, pour que la réduction ne touche jamais le bord du calque)
  const add = async (name, src, w, h, anchor, meta) => {
    const im = await load(src), o = new OffscreenCanvas(im.naturalWidth, im.naturalHeight); o.getContext("2d").drawImage(im, 0, 0);
    const c = new OffscreenCanvas(Math.max(1, Math.round(w)) + 2, Math.max(1, Math.round(h)) + 2), x = c.getContext("2d");
    x.imageSmoothingQuality = "high"; x.drawImage(im, 1, 1, c.width - 2, c.height - 2);
    const [ax, ay] = anchor(c.width - 2, c.height - 2);
    items.push({ name, c, anchor: [ax + 1, ay + 1], meta, bords: edges(o) });
  };
  for (const [i, a] of A.algues.entries()) await add(`lagon.algue.${i}`, a.src, a.w * k, a.h * k, () => [0, 0], { x: a.x, y: a.y, w: a.w, h: a.h });
  for (const [key, f] of Object.entries(A.fish)) await add(`lagon.poisson.${key}`, f.src, f.w * k, f.h * k, (w, h) => [Math.round(w / 2), Math.round(h / 2)], { w: f.w, h: f.h });
  // les faisceaux : le procédé de la maquette (makeShaft), avec son propre tirage à graine fixe ; une texture
  // de 96 × 512 étirée à l'affichage, à la même taille aux deux échelles
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, R = (a, b) => a + (b - a) * rnd();
  const smooth = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  for (let s = 0; s < 6; s++) {
    const w = 96, h = 512, c = new OffscreenCanvas(w, h), x = c.getContext("2d"), im = x.createImageData(w, h);
    const n = 3 + Math.floor(rnd() * 4), comps = []; for (let i = 0; i < n; i++) comps.push({ c: R(0.2, 0.8), s: R(0.03, 0.13), a: R(0.4, 1) });
    const prof = new Float32Array(w); let mx = 0;
    for (let i = 0; i < w; i++) { const u = i / (w - 1); let v = 0; for (const q of comps) v += q.a * Math.exp(-((u - q.c) ** 2) / (2 * q.s * q.s)); prof[i] = v; mx = Math.max(mx, v); }
    const ph = R(0, 10);
    for (let y = 0; y < h; y++) { const v = y / (h - 1), vert = smooth(0, 0.06, v) * Math.pow(1 - v, 1.6) * (0.85 + 0.15 * Math.sin(v * 23 + ph)); for (let i = 0; i < w; i++) { const o = (y * w + i) * 4; im.data[o] = 255; im.data[o + 1] = 250; im.data[o + 2] = 226; im.data[o + 3] = Math.round((prof[i] / mx) * vert * 255); } }
    x.putImageData(im, 0, 0);
    items.push({ name: `lagon.faisceau.${s}`, c, anchor: [0, 0], meta: null, bords: edges(c) });
  }
  // 3. la planche « lagon-vie » : rangées simples, 2 px de marge transparente entre les images
  const SW = 1024, M = 2; let x = M, y = M, row = 0;
  for (const it of [...items].sort((a, b) => b.c.height - a.c.height)) {
    if (x + it.c.width + M > SW) { x = M; y += row + M; row = 0; }
    it.at = [x, y]; x += it.c.width + M; row = Math.max(row, it.c.height);
  }
  const vie = new OffscreenCanvas(SW, y + row + M), gv = vie.getContext("2d");
  for (const it of items) gv.drawImage(it.c, it.at[0], it.at[1]);
  const blobF = await fond.convertToBlob({ type: "image/webp", quality: fondQ }), blobV = await vie.convertToBlob({ type: "image/webp", quality: vieQ });
  return {
    fond: { b64: await b64(blobF), w: W, h: H, hash: await hash(fond) },
    vie: { b64: await b64(blobV), w: SW, h: vie.height, hash: await hash(vie) },
    items: items.map((it) => ({ name: it.name, rect: [0, it.at[0], it.at[1], it.c.width, it.c.height, -it.anchor[0], -it.anchor[1]], meta: it.meta, bords: it.bords })),
    decor: decor.map((d) => `${d.key} (${d.layer})`),
  };
};

// une extraction complète, dans une page neuve ; renvoie ce qu'il faut écrire
async function extract(browser, M, scale) {
  const page = await (await browser.newContext()).newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.setContent("<!doctype html><meta charset=utf-8><title>lagon</title>");
  await page.addScriptTag({ content: `window.PAGE = ${PAGE};` });
  const r = await page.evaluate((args) => window.PAGE(args), { A: M.A, W: SCENE.W * scale, H: SCENE.H * scale, fondQ: FOND_QUALITE, vieQ: VIE_QUALITE, EDGE: EDGE_ALPHA, sceneW: SCENE.W, sceneH: SCENE.H });
  await page.context().close();
  if (errs.length) throw new Error(`export-lagon : ${errs.join(" ; ")}`);
  return r;
}

// fabrique les planches et complète l'atlas (objet modifié en place) ; `browser` : un Chromium de Playwright
export async function exportLagon({ browser, atlas, OUT, check = true, log = console.log }) {
  const M = readMaquette();
  const sha = (b) => createHash("sha256").update(b).digest("hex").slice(0, 16);
  let bad = 0;
  for (const name of Object.keys(atlas.sprites)) if (name.startsWith("lagon.")) delete atlas.sprites[name];
  for (const scale of [1, 2]) {
    const r = await extract(browser, M, scale);
    for (const f of readdirSync(OUT)) if (f.startsWith(`lagon@${scale}x`) || f.startsWith(`lagon-vie@${scale}x`)) unlinkSync(join(OUT, f));
    const fondFile = `lagon@${scale}x.webp`, vieFile = `lagon-vie@${scale}x.webp`, fondBuf = Buffer.from(r.fond.b64, "base64"), vieBuf = Buffer.from(r.vie.b64, "base64");
    writeFileSync(join(OUT, fondFile), fondBuf); writeFileSync(join(OUT, vieFile), vieBuf);
    atlas.sheets[`lagon@${scale}`] = [{ file: fondFile, w: r.fond.w, h: r.fond.h }];
    atlas.sheets[`lagon-vie@${scale}`] = [{ file: vieFile, w: r.vie.w, h: r.vie.h }];
    const fond = (atlas.sprites["lagon.fond"] ??= { sheet: "lagon", fps: 0, frames: 1, meta: null, rects: {}, bords: {} });
    fond.meta = { source: `art/recif-vivant/index.html (empreinte ${M.empreinte})`, panorama: { W: M.A.W, H: M.A.H }, vue: (M.A.H * SCENE.W) / SCENE.H, top: M.A.top, tete: M.HEAD, solos: M.SOLOS, bancs: M.SCHOOLS };
    fond.rects[scale] = [[0, 0, 0, r.fond.w, r.fond.h, 0, 0]]; fond.bords[scale] = [r.fond.w, r.fond.h, r.fond.w, r.fond.h];
    for (const it of r.items) {
      const s = (atlas.sprites[it.name] ??= { sheet: "lagon-vie", fps: 0, frames: 1, meta: it.meta, rects: {}, bords: {} });
      s.rects[scale] = [it.rect]; s.bords[scale] = it.bords;
    }
    let same = "non vérifié";
    if (check) {
      const r2 = await extract(browser, M, scale);
      const diffs = [["fond", r.fond.hash, r2.fond.hash], ["vie", r.vie.hash, r2.vie.hash], ["fichier du fond", sha(fondBuf), sha(Buffer.from(r2.fond.b64, "base64"))], ["fichier de la vie", sha(vieBuf), sha(Buffer.from(r2.vie.b64, "base64"))]].filter(([, a, b]) => a !== b).map(([n]) => n);
      same = diffs.length ? `NON REPRODUCTIBLE (${diffs.join(", ")})` : "reproductible"; if (diffs.length) bad++;
    }
    log(`${`lagon@${scale}x`.padEnd(26)} 1 page(s) ${`${r.fond.w}×${r.fond.h}`.padEnd(20)} ${`${(fondBuf.length / 1024).toFixed(0)} Ko`.padStart(8)}  décodé ${`${((r.fond.w * r.fond.h * 4) / 1048576).toFixed(1)} Mo`.padStart(8)}  ${same}`);
    log(`${`lagon-vie@${scale}x`.padEnd(26)} 1 page(s) ${`${r.vie.w}×${r.vie.h}`.padEnd(20)} ${`${(vieBuf.length / 1024).toFixed(0)} Ko`.padStart(8)}  décodé ${`${((r.vie.w * r.vie.h * 4) / 1048576).toFixed(1)} Mo`.padStart(8)}  ${same}`);
    if (scale === 1) log(`  flore posée dans le fond : ${r.decor.join(", ") || "aucune"}`);
  }
  return bad;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { detect } = await import("./detect.mjs");
  const env = detect();
  if (!env.pw.ok || !env.browser.ok) { console.error(`export-lagon : pas de navigateur : ${env.report.playwright} / ${env.report.browser}`); process.exit(1); }
  const OUT = resolve(HERE, "../app/assets/art"), atlasPath = join(OUT, "atlas.json");
  const atlas = existsSync(atlasPath) ? JSON.parse(readFileSync(atlasPath, "utf8")) : { version: 1, generated: "art/tools/export-app.mjs", sheets: {}, sprites: {} };
  const browser = await env.pw.lib.chromium.launch({ executablePath: env.browser.executablePath, args: ["--disable-gpu"] });
  const bad = await exportLagon({ browser, atlas, OUT, check: !process.argv.includes("--no-check") });
  await browser.close();
  atlas.hash = createHash("md5").update(JSON.stringify(atlas.sprites)).digest("hex").slice(0, 10);
  writeFileSync(atlasPath, JSON.stringify(atlas));
  console.log(`atlas    -> ${atlasPath} (${Object.keys(atlas.sprites).length} sprites, empreinte ${atlas.hash})`);
  if (bad) { console.error(`export-lagon : ${bad} contrôle(s) en échec`); process.exit(1); }
}
