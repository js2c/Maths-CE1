// LES BOUTONS FAITS D'UNE IMAGE DU PARENT (lot « Nouveaux boutons, mascotte du récif et étoiles », décisions du parent du
// 7 novembre 2026 ; CLAUDE.md, l'exception des boutons). Une seule commande pour tout ce que le parent a déposé dans
// art/boutons/sources/ (art/boutons/boutons.json : quelle source donne quel bouton), que l'application lit dans app/assets/boutons/ :
//  - LE FOND : un vert uni, qui varie d'une image à l'autre ; il est MESURÉ IMAGE PAR IMAGE (la médiane des pixels du bord de
//    l'image), puis chaque pixel est jugé sur son écart à ce vert (ou au magenta, pour une source dont le fond est magenta) ;
//  - LES BOUTONS : les grandes taches qui ne sont pas du fond ; une planche en a plusieurs, lues par rangées (de haut en bas,
//    puis de gauche à droite) ;
//  - LE CERCLE EXACT de chaque bouton : ajusté (moindres carrés, puis une seconde fois sans les points qui s'en écartent) sur le
//    bord extérieur de la tache (le premier et le dernier pixel de chaque ligne et de chaque colonne) : c'est le bord de l'anneau gris ;
//  - LES IMAGES : le carré qui entoure ce cercle, réduit par moitiés successives jusqu'à la taille de chaque usage de l'application
//    (app/js/engine/boutons.js : le diamètre en px de scène), @1x et @2x, découpé sur le cercle (bord adouci sur un pixel) ; le
//    reflet du vert sur le bord de l'anneau est ramené au gris. Écrit app/assets/boutons/<image>-<diamètre>@1x|2x.webp et index.json
//    (ce qui a son image : un usage sans image garde l'ancien dessin de l'atelier).
// Déterministe : une même source donne les mêmes fichiers ; les sources ne sont jamais modifiées.
//   node art/tools/export-boutons.mjs                      (depuis la racine du dépôt ou depuis art/)
//   node art/tools/export-boutons.mjs --controle out.png   (en plus : une planche de contrôle, chaque bouton sur fond clair et
//                                                           sombre, le cercle ajusté tracé en rouge sur la source)
//   puis : node tools/precache.mjs
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { detect } from "./detect.mjs";
import { USAGES, fichier, tailles } from "../../app/js/engine/boutons.js";

const ICI = dirname(fileURLToPath(import.meta.url)), ART = resolve(ICI, ".."), ROOT = resolve(ART, "..");
const SRC = join(ART, "boutons/sources"), OUT = join(ROOT, "app/assets/boutons"), QUALITE = 0.9;
const EXT = ["png", "jpg", "jpeg", "webp"];
const MIME = (f) => (f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : "image/jpeg");
// un pixel est du bouton quand il s'écarte du fond de plus de SEUIL (distance dans l'espace RVB, 0 à 441)
export const SEUIL = 90;
// la bande extérieure de l'anneau où le reflet du vert est ramené au gris (fraction du rayon)
export const BANDE = 0.92;

// L'AJUSTEMENT D'UN CERCLE (fonction pure, testée : tests/unit/boutons.test.mjs) : moindres carrés algébriques (Kåsa), puis une
// seconde fois sans les points à plus de `tol` px du premier cercle. Renvoie { cx, cy, r, ecart } (ecart : la moyenne quadratique
// des distances des points gardés au cercle).
export function ajusterCercle(points, tol = 2.5) {
  const fit = (P) => {
    let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0; const n = P.length;
    for (const [x, y] of P) { const z = x * x + y * y; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; sxz += x * z; syz += y * z; sz += z; }
    // [sxx sxy sx; sxy syy sy; sx sy n] [D E F]' = -[sxz syz sz]'
    const A = [[sxx, sxy, sx, -sxz], [sxy, syy, sy, -syz], [sx, sy, n, -sz]];
    for (let i = 0; i < 3; i++) { let p = i; for (let k = i + 1; k < 3; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k; [A[i], A[p]] = [A[p], A[i]]; for (let k = 0; k < 3; k++) if (k !== i) { const f = A[k][i] / A[i][i]; for (let j = i; j < 4; j++) A[k][j] -= f * A[i][j]; } }
    const D = A[0][3] / A[0][0], E = A[1][3] / A[1][1], F = A[2][3] / A[2][2], cx = -D / 2, cy = -E / 2;
    return { cx, cy, r: Math.sqrt(Math.max(0, cx * cx + cy * cy - F)) };
  };
  const c0 = fit(points), garde = points.filter(([x, y]) => Math.abs(Math.hypot(x - c0.cx, y - c0.cy) - c0.r) <= tol);
  const c = garde.length >= 8 ? fit(garde) : c0, P = garde.length >= 8 ? garde : points;
  const ecart = Math.sqrt(P.reduce((s, [x, y]) => s + (Math.hypot(x - c.cx, y - c.cy) - c.r) ** 2, 0) / P.length);
  return { ...c, ecart, points: points.length, gardes: P.length };
}
// l'ordre de lecture d'une planche : par rangées (deux centres dont l'écart vertical est inférieur au rayon moyen sont sur la même
// rangée), de haut en bas, puis de gauche à droite (fonction pure, testée)
export function ordreLecture(cercles) {
  const r = cercles.reduce((s, c) => s + c.r, 0) / Math.max(1, cercles.length), rangees = [];
  for (const c of [...cercles].sort((a, b) => a.cy - b.cy)) { const R = rangees.find((g) => Math.abs(g[0].cy - c.cy) < r); if (R) R.push(c); else rangees.push([c]); }
  return rangees.flatMap((g) => g.sort((a, b) => a.cx - b.cx));
}

// (dans le navigateur) L'ANALYSE D'UNE SOURCE : le fond mesuré, les taches du bouton, leur bord extérieur
const ANALYSER = async ([data, seuil, fraction]) => {
  const img = new Image(); img.src = data; await img.decode();
  const W = img.width, H = img.height, c = new OffscreenCanvas(W, H), x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, 0, 0); const p = x.getImageData(0, 0, W, H).data;
  // le fond : la médiane, canal par canal, d'une bande de 6 px tout autour
  const bord = [[], [], []];
  for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) { if (y >= 6 && y < H - 6 && i >= 6 && i < W - 6) continue; const k = 4 * (y * W + i); for (let j = 0; j < 3; j++) bord[j].push(p[k + j]); }
  const fond = bord.map((v) => { v.sort((a, b) => a - b); return v[v.length >> 1]; });
  const ecartType = bord.map((v, j) => Math.sqrt(v.reduce((s, a) => s + (a - fond[j]) ** 2, 0) / v.length));
  const m = new Uint8Array(W * H), minAire = fraction * W * H;
  for (let i = 0; i < W * H; i++) { const dr = p[4 * i] - fond[0], dg = p[4 * i + 1] - fond[1], db = p[4 * i + 2] - fond[2]; m[i] = dr * dr + dg * dg + db * db > seuil * seuil ? 1 : 0; }
  // les taches (4-connexité) ; seules les grandes sont des boutons
  const lab = new Int32Array(W * H), pile = new Int32Array(W * H), taches = []; let n = 0;
  for (let s = 0; s < W * H; s++) {
    if (!m[s] || lab[s]) continue;
    n++; let top = 0, aire = 0; pile[top++] = s; lab[s] = n;
    while (top) { const k = pile[--top]; aire++; const kx = k % W, ky = (k / W) | 0;
      if (kx > 0 && m[k - 1] && !lab[k - 1]) { lab[k - 1] = n; pile[top++] = k - 1; }
      if (kx < W - 1 && m[k + 1] && !lab[k + 1]) { lab[k + 1] = n; pile[top++] = k + 1; }
      if (ky > 0 && m[k - W] && !lab[k - W]) { lab[k - W] = n; pile[top++] = k - W; }
      if (ky < H - 1 && m[k + W] && !lab[k + W]) { lab[k + W] = n; pile[top++] = k + W; } }
    if (aire >= minAire) taches.push({ id: n, aire });
  }
  // le bord extérieur de chaque grande tache : le premier et le dernier pixel de chaque ligne et de chaque colonne
  return { W, H, fond, ecartType, taches: taches.map(({ id, aire }) => {
    const pts = [];
    for (let y = 0; y < H; y++) { let a = -1, b = -1; for (let i = 0; i < W; i++) if (lab[y * W + i] === id) { if (a < 0) a = i; b = i; } if (a >= 0) pts.push([a, y + 0.5], [b + 1, y + 0.5]); }
    for (let i = 0; i < W; i++) { let a = -1, b = -1; for (let y = 0; y < H; y++) if (lab[y * W + i] === id) { if (a < 0) a = y; b = y; } if (a >= 0) pts.push([i + 0.5, a], [i + 0.5, b + 1]); }
    return { aire, pts };
  }) };
};
// (dans le navigateur) UN BOUTON À UNE TAILLE : le carré du cercle, réduit par moitiés jusqu'à `taille` px, découpé sur le cercle,
// le reflet du vert ramené au gris dans la bande extérieure de l'anneau
const DECOUPER = async ([data, C, taille, q, bande, magenta, fond]) => {
  const img = new Image(); img.src = data; await img.decode();
  const R = C.r - 0.5; // (le demi-pixel de bord, mêlé de fond, est laissé au-dehors)
  let w = 2 * R, src = img, sx = C.cx - R, sy = C.cy - R;
  // réductions par moitiés (chacune lissée avec soin), puis la dernière à la taille exacte
  while (w / 2 >= taille) {
    const n = Math.round(w / 2), c = new OffscreenCanvas(n, n), x = c.getContext("2d");
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(src, sx, sy, w, w, 0, 0, n, n);
    src = c; sx = 0; sy = 0; w = n;
  }
  const c = new OffscreenCanvas(taille, taille), x = c.getContext("2d", { willReadFrequently: true });
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(src, sx, sy, w, w, 0, 0, taille, taille);
  const d = x.getImageData(0, 0, taille, taille), p = d.data, r0 = taille / 2;
  for (let y = 0; y < taille; y++) for (let i = 0; i < taille; i++) {
    const k = 4 * (y * taille + i), e = Math.hypot(i + 0.5 - r0, y + 0.5 - r0);
    // le cercle, bord adouci sur un pixel
    p[k + 3] = Math.round(255 * Math.min(1, Math.max(0, r0 - e + 0.5)));
    // dans la bande extérieure : là où l'anneau dessiné n'est pas tout à fait rond, le fond peut affleurer sous le cercle (un liseré
    // d'un pixel) ; un pixel proche du fond mesuré devient transparent, et la part du fond est retirée de sa couleur (démélange)
    if (e > bande * r0) {
      const dist = Math.hypot(p[k] - fond[0], p[k + 1] - fond[1], p[k + 2] - fond[2]);
      let t = Math.min(1, Math.max(0, (dist - 50) / 130)); t = t * t * (3 - 2 * t);
      if (t < 1) { p[k + 3] = Math.round(p[k + 3] * t); if (t > 0.02) for (let j = 0; j < 3; j++) p[k + j] = Math.min(255, Math.max(0, (p[k + j] - (1 - t) * fond[j]) / t)); }
    }
    // le reflet du fond dans la bande extérieure : l'excès de vert (ou de rouge et de bleu, pour le magenta) ramené
    if (e > bande * r0) { const [r, g, b] = [p[k], p[k + 1], p[k + 2]];
      if (magenta) { const s = Math.min(r, b) - g; if (s > 0) { p[k] = r - s; p[k + 2] = b - s; } }
      else { const s = g - Math.max(r, b); if (s > 0) p[k + 1] = g - s; } }
  }
  x.putImageData(d, 0, 0);
  const res = {};
  const blob = await c.convertToBlob({ type: "image/webp", quality: q }), u8 = new Uint8Array(await blob.arrayBuffer()); let s = "";
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  res.b64 = btoa(s);
  return res;
};

export async function exportBoutons({ controle = null } = {}) {
  mkdirSync(OUT, { recursive: true });
  const conf = JSON.parse(readFileSync(join(ART, "boutons/boutons.json"), "utf8")), T = tailles(USAGES);
  const env = detect();
  if (!env.pw.ok || !env.browser.ok) throw new Error(`export-boutons : pas de navigateur (${env.report.playwright} / ${env.report.browser})`);
  const browser = await env.pw.lib.chromium.launch({ executablePath: env.browser.executablePath, args: ["--disable-gpu"] });
  const page = await (await browser.newContext()).newPage();
  await page.goto("about:blank");
  const images = {}, ecrits = new Set(), mesures = {}, manquent = [], vus = [];
  for (const [source, noms] of Object.entries(conf.sources).sort(([a], [b]) => a.localeCompare(b))) {
    const f = EXT.map((e) => join(SRC, `${source}.${e}`)).find((x) => existsSync(x));
    if (!f) { manquent.push(...noms); continue; }
    const magenta = (conf.magenta ?? []).includes(source), data = `data:${MIME(f)};base64,${readFileSync(f).toString("base64")}`;
    const a = await page.evaluate(ANALYSER, [data, SEUIL, 0.01]);
    const cercles = ordreLecture(a.taches.map((t) => ({ ...ajusterCercle(t.pts), aire: t.aire })));
    console.log(`  source ${source} : ${a.W} × ${a.H}, fond mesuré rgb(${a.fond.join(", ")}) (écart type ${a.ecartType.map((v) => v.toFixed(1)).join(" / ")}), ${cercles.length} bouton(s)`);
    if (cercles.length !== noms.length) throw new Error(`export-boutons : la source ${source} a ${cercles.length} bouton(s), boutons.json en attend ${noms.length} (${noms.join(", ")})`);
    noms.forEach((nom, i) => {
      const C = cercles[i], rondeur = C.aire / (Math.PI * C.r * C.r);
      mesures[nom] = { source, fond: a.fond, cercle: [Math.round(C.cx * 10) / 10, Math.round(C.cy * 10) / 10, Math.round(C.r * 10) / 10], ecart: Math.round(C.ecart * 100) / 100, rondeur: Math.round(rondeur * 1000) / 1000 };
      console.log(`    ${nom} : centre (${C.cx.toFixed(1)}, ${C.cy.toFixed(1)}), rayon ${C.r.toFixed(1)} px, écart au cercle ${C.ecart.toFixed(2)} px (${C.gardes}/${C.points} points), aire / cercle ${rondeur.toFixed(3)}`);
      vus.push({ nom, data, C, magenta, fond: a.fond });
    });
  }
  for (const { nom, data, C, magenta, fond } of vus) {
    for (const d of T[nom] ?? []) {
      for (const k of [1, 2]) {
        const out = await page.evaluate(DECOUPER, [data, { cx: C.cx, cy: C.cy, r: C.r }, d * k, QUALITE, BANDE, magenta, fond]);
        const f = `${fichier(nom, d)}@${k}x.webp`; writeFileSync(join(OUT, f), Buffer.from(out.b64, "base64")); ecrits.add(f);
      }
      (images[nom] ??= []).push(d);
    }
    if (!T[nom]) console.log(`    (${nom} : aucun usage dans l'application)`);
  }
  if (controle) await planche(page, vus, controle);
  await browser.close();
  // les images qui n'ont plus d'usage ou de source disparaissent (le bouton de l'espace parent, fait par decoupe.py, reste)
  for (const f of readdirSync(OUT)) if (f.endsWith(".webp") && !f.startsWith("parents@") && !ecrits.has(f)) unlinkSync(join(OUT, f));
  const sans = Object.keys(T).filter((n) => !images[n]);
  writeFileSync(join(OUT, "index.json"), `${JSON.stringify({ _doc: "Généré par art/tools/export-boutons.mjs : les images des boutons du parent qui existent (<image>-<diamètre>@1x|2x.webp, le diamètre en px de scène), et la mesure de chacune (la source, le vert du fond, le cercle ajusté en px de la source, l'écart moyen du bord au cercle). Un usage dont l'image manque garde l'ancien dessin de l'atelier (app/js/engine/boutons.js).", images, mesures }, null, 1)}\n`);
  console.log(`boutons : ${Object.keys(images).length} images, ${ecrits.size} fichiers${sans.length ? ` ; SANS SOURCE (l'ancien dessin reste) : ${sans.join(", ")}` : ""}${manquent.length ? ` ; sources absentes : ${manquent.join(", ")}` : ""}`);
  return { images, mesures, sans };
}

// LA PLANCHE DE CONTRÔLE : pour chaque bouton, la source autour du cercle avec le cercle ajusté en rouge, puis l'image de chaque
// taille à @2x, sur fond clair et sur fond sombre
async function planche(page, vus, chemin) {
  const T = tailles(USAGES), lignes = [];
  for (const { nom, data, C } of vus) lignes.push({ nom, data, C, tailles: T[nom] ?? [], fichiers: (T[nom] ?? []).map((d) => `data:image/webp;base64,${readFileSync(join(OUT, `${fichier(nom, d)}@2x.webp`)).toString("base64")}`) });
  const png = await page.evaluate(async (L) => {
    const hauteur = (l) => Math.max(440, 4 * Math.max(0, ...l.tailles) + 110), W = 1900, ys = [];
    let tot = 0; for (const l of L) { ys.push(tot); tot += hauteur(l); }
    const c = new OffscreenCanvas(W, tot), x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, W, c.height); x.font = "20px sans-serif";
    for (let j = 0; j < L.length; j++) {
      const l = L[j], y0 = ys[j], img = new Image(); img.src = l.data; await img.decode();
      const m = l.C.r * 1.08, k = 400 / (2 * m);
      x.drawImage(img, l.C.cx - m, l.C.cy - m, 2 * m, 2 * m, 10, y0 + 20, 400, 400);
      x.strokeStyle = "#f00"; x.lineWidth = 1.5; x.beginPath(); x.arc(10 + 200, y0 + 220, l.C.r * k, 0, 2 * Math.PI); x.stroke();
      x.fillStyle = "#000"; x.fillText(`${l.nom} (rayon ${l.C.r.toFixed(1)} px, écart ${l.C.ecart.toFixed(2)})`, 430, y0 + 24);
      let cx = 430;
      for (let i = 0; i < l.fichiers.length; i++) {
        const b = new Image(); b.src = l.fichiers[i]; await b.decode();
        for (const [fond, dy] of [["#e9dfc8", 40], ["#0b3f4a", 40 + b.height + 10]]) { x.fillStyle = fond; x.fillRect(cx - 4, y0 + dy - 4, b.width + 8, b.height + 8); x.drawImage(b, cx, y0 + dy); }
        x.fillStyle = "#000"; x.fillText(`${l.tailles[i]}`, cx, y0 + 40 + 2 * b.height + 40);
        cx += b.width + 24;
      }
    }
    const blob = await c.convertToBlob({ type: "image/png" }), u8 = new Uint8Array(await blob.arrayBuffer()); let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    return btoa(s);
  }, lignes);
  writeFileSync(chemin, Buffer.from(png, "base64"));
  console.log(`planche de contrôle : ${chemin}`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const i = process.argv.indexOf("--controle");
  await exportBoutons({ controle: i > 0 ? resolve(process.argv[i + 1]) : null });
}
