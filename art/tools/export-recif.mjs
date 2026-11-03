// LE RÉCIF VIVANT DANS L'APPLICATION (docs/SPEC.md, section 10, « Le récif vivant »). La collection de l'enfant est la
// maquette du récif vivant (art/recif-vivant/index.html), validée par le parent, intégrée telle quelle : on ne la réécrit
// pas, on la transporte. Cet outil, sans jamais modifier la maquette :
//   1. sort ses images (embarquées en base64) dans app/assets/recif/ (un fichier par image, au format d'origine) et ses
//      données (géométrie, relief, réglages des sprites) dans app/assets/recif/donnees.json ;
//   2. fabrique app/js/recif/recif-vivant.js : le script de la maquette lui-même, enveloppé dans une fonction
//      `startRecif(OPTS)`, avec ses seuls raccords à l'application retouchés (RETOUCHES ci-dessous : l'écran et ses
//      canvas, la taille et la densité, le toucher, la fiche remplacée par la carte de la collection, les créatures
//      possédées seulement, le scintillement des brillantes, l'arrêt de l'animation en sortant ; depuis le lot « Netteté du
//      récif », le dessin des créatures depuis une image déjà réduite, et leur allègement : LAGBLIT). Chaque retouche doit
//      trouver son texte exactement une fois : si la maquette change, l'export échoue au lieu de produire un module faux.
//
//   node tools/export-recif.mjs
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = resolve(new URL(".", import.meta.url).pathname, "..");
const MAQUETTE = join(HERE, "recif-vivant/index.html"), APP = resolve(HERE, "../app");
const OUT_IMG = join(APP, "assets/recif"), OUT_JS = join(APP, "js/recif/recif-vivant.js");
const DONNEES = ["A", "SUB", "ABYSS_FISH", "LAGON_SPR", "CORAIL_SPR", "LARGE_SPR", "ABYSSES_SPR"];

// LE GRAND LARGE (décision du parent du 5 octobre 2026) : dans la maquette, neuf des quinze nageuses tournent entre 175 et
// 900 px du panorama (de haut 1 774), là où croise le sous-marin (550 à 850), et se croisent en grappe devant lui. Elles
// sont réparties sur toute la hauteur : le poisson volant et le dauphin gardent leur place près de la surface, les treize
// autres vont dans des couloirs réguliers de 340 à 1 570 px (pas de 103 px). Quelle nageuse dans quel couloir : cherché par
// tools/grand-large.mjs, qui simule une heure de rondes. Gain mesuré (moyennes) : recouvrements francs entre nageuses
// 4,44 → 3,72 ; avec le sous-marin 0,48 → 0,40 ; une grappe d'au moins trois nageuses 95 % → 69 % du temps ; la pire
// grappe 9 → 5 nageuses. Seule la profondeur change ; la ronde, la vitesse, le sens et la taille restent ceux de la maquette.
export const PROFONDEURS = {
  "poisson-volant": 175, dauphin: 235, otarie: 340, "raie-manta": 445, "thon-rouge": 545, espadon: 650, "requin-bleu": 750,
  "requin-marteau": 855, "requin-baleine": 955, "grand-requin-blanc": 1060, orque: 1160, "poisson-lune": 1265,
  "baleine-a-bosse": 1365, meduse: 1470, "tortue-luth": 1570,
};

// les raccords : [ce que dit la maquette, ce que dit l'application, pourquoi]
const RETOUCHES = [
  ["const cv = document.getElementById('c'), ctx = cv.getContext('2d');", "const cv = OPTS.cv, ctx = cv.getContext('2d');", "le canvas du dessin est fourni par l'application"],
  ["const glc = document.getElementById('gl');", "const glc = OPTS.glc;", "le canvas WebGL du fond aussi"],
  ["const lagImg = {}; for (const k in LAGON_SPR) lagImg[k] = loadImg(LAGON_SPR[k].src);", "const lagImg = {}; for (const k in LAGON_SPR) if (OPTS.owned.has(k)) lagImg[k] = loadImg(LAGON_SPR[k].src);", "seules les images des créatures possédées sont chargées"],
  ["const lagOrder = LAGON.slice()", "for (const c of LAGON) if (OPTS.donnees.PROFONDEURS?.[c.id] != null) c.y = OPTS.donnees.PROFONDEURS[c.id];\nconst lagOrder = LAGON.filter((c) => OPTS.owned.has(c.id)).slice()", "seules les créatures possédées vivent dans le récif ; les nageuses du grand large à leur profondeur (PROFONDEURS)"],
  ["    lagBlit(c, img, t, X0, Y0, 0.7);\n", "    lagBlit(c, img, t, X0, Y0, 0.7);\n    if (OPTS.brillantes.has(c.id)) OPTS.scintille(ctx, c, X0, Y0, t, sc*c.k);\n", "une créature brillante scintille"],
  ["const dpr = Math.min(2, window.devicePixelRatio || 1);", "const dpr = OPTS.dpr();", "la densité est choisie par l'application (allègement)"],
  ["addEventListener('resize', resize); resize();", "OPTS.on(window, 'resize', resize); resize();", "écouteurs de la fenêtre retirés en sortant"],
  ["const hint = document.getElementById('hint');", "const hint = { classList: { add() {} } };", "pas de texte pour l'enfant (« Glisse pour explorer la mer »)"],
  ["const ficheEl = document.getElementById('fiche');", "const ficheEl = { classList: { add() {}, remove() {} }, addEventListener() {} };", "la fiche de la maquette est remplacée par la carte de la collection"],
  ["const bR = document.getElementById('bRays'), bF = document.getElementById('bFish');", "const bR = {}, bF = {};", "pas de boutons d'essai"],
  ["const bC = document.getElementById('bCrea');", "const bC = {};", "pas de boutons d'essai"],
  ["const zoneEl = document.getElementById('zone');", "const zoneEl = { textContent: '' };", "pas de nom de zone écrit (l'enfant ne lit pas)"],
  // (lot « La boutique du récif ») la créature qui vient d'être achetée arrive à la nage, avec son halo, jusqu'à sa place :
  // OPTS.arrivee(id, t, x à l'écran, largeur vue) donne son décalage { dx, dy } et son halo, ou null
  ["const P = c.pose ? c.pose(t, c) : {}, dx = P.dx || 0, dy = P.dy || 0, rot = P.rot || 0, sx = (P.sx || 1)*kf, sy = (P.sy || 1)*kf;", "const P = c.pose ? c.pose(t, c) : {}, AR = OPTS.arrivee?.(c.id, t, c.x - camX, viewW) ?? null, dx = (P.dx || 0) + (AR ? AR.dx : 0), dy = (P.dy || 0) + (AR ? AR.dy : 0), rot = P.rot || 0, sx = (P.sx || 1)*kf*(AR ? AR.s : 1), sy = (P.sy || 1)*kf*(AR ? AR.s : 1); c.agrandi = AR ? AR.s : 1;", "la créature achetée arrive à la nage, plus grande au milieu de son arc"],
  ["c.halo += ((c === hoverC || c === holdC ? 1 : 0) - c.halo)*0.2;", "c.halo += ((c === hoverC || c === holdC || AR?.halo ? 1 : 0) - c.halo)*0.2;", "et avec son halo"],
  ["function frame(now){\n  requestAnimationFrame(frame);", "function frame(now){\n  if (!VIVANT) return; RAF = requestAnimationFrame(frame); OPTS.mesure?.(now);", "l'animation s'arrête en sortant ; le temps d'image est mesuré"],
];
// la fiche : remplacée par la carte de la collection (session/recif.js)
const FICHE = [/function ouvreFiche\(c\)\{[\s\S]*?\n\}\n/, "function ouvreFiche(c){ hoverC = null; vel = 0; OPTS.onFiche(c.id); }\n"];
// (lot « Netteté du récif », décision du parent du 31 octobre 2026) LE DESSIN D'UNE CRÉATURE (lagBlit) : la même déformation que
// la maquette (mêmes fonctions col et row, mêmes bandes, même recouvrement), mais
//  - depuis l'image déjà réduite à la taille d'affichage (OPTS.reduite, recif/reduction.js) au lieu de l'image d'environ 600 px
//    réduite 4 à 8 fois à chaque image : net (pas de crénelage) et moins coûteux ; la grande image en attendant qu'elle soit
//    prête, et pendant l'arrivée d'une créature achetée, quand elle grossit (c.agrandi) ;
//  - selon l'allègement (OPTS.qualite() : { cadence, bandes, image }) : avec `cadence`, la créature déformée est gardée dans
//    une image, refaite au plus `cadence` fois par seconde et au plus une image sur deux (la moitié des créatures à chaque image,
//    selon leur rang : `image` est le numéro de l'image), et dessinée d'un seul appel entre-temps ; ainsi le cran allège aussi un
//    appareil très lent (une cadence en temps seulement y referait chaque créature à chaque image) ; `bandes` : la part des
//    bandes de déformation gardées.
const LAGBLIT = [/function lagBlit\(c, src, t, X0, Y0, rec\)\{[\s\S]*?\n\}\n/, `function lagBlit(c, src, t, X0, Y0, rec){
  const Q = OPTS.qualite(), RD = (c.agrandi || 1) > 1.05 ? null : OPTS.reduite(src, c.w, c.h, sc*c.k), im = RD ? RD.img : src, r = RD ? RD.r : 1;
  const NC = Math.max(4, Math.round((c.nc || LAG_NC)*Q.bandes)), NR = Math.max(4, Math.round((c.nr || LAG_NR)*Q.bandes));
  if (Q.cadence && (c.col || c.row) && src === lagImg[c.id]){
    c.cadRang ??= lagOrder.indexOf(c) % 2;
    const W2 = Math.ceil((c.w + 2*c.pad)*r), H2 = Math.ceil((c.h + 2*c.pad)*r);
    if (!c.cad || c.cad.width !== W2 || c.cad.height !== H2){ c.cad = c.cad || OPTS.canvas(); c.cad.width = W2; c.cad.height = H2; c.cadg = c.cad.getContext('2d'); c.cadT = null; }
    const due = c.cadT == null || (Q.image - c.cadF >= 2 && (Q.image + c.cadRang) % 2 === 0 && t - c.cadT >= 1/Q.cadence);
    if (due || c.cadIm !== im || c.cadN !== NC*100 + NR){
      const g = c.cadg; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W2, H2); g.setTransform(r, 0, 0, r, c.pad*r, c.pad*r);
      lagDeforme(g, c, im, r, t, 0, 0, rec, NC, NR); c.cadT = t; c.cadF = Q.image; c.cadIm = im; c.cadN = NC*100 + NR;
    }
    ctx.drawImage(c.cad, X0 - c.pad, Y0 - c.pad, W2/r, H2/r);
    return;
  }
  lagDeforme(ctx, c, im, r, t, X0, Y0, rec, NC, NR);
}
// la déformation de la maquette, dessinée dans g (repère : px de l'image de la créature) depuis im, la même image à l'échelle r
function lagDeforme(g, c, im, r, t, X0, Y0, rec, NC, NR){
  const pad = c.pad, w = c.w, h = c.h;
  if (c.col && c.row){
    // deux passes : colonnes dans un canvas de travail (à l'échelle de l'image), puis lignes
    const W2 = Math.ceil((w + 2*pad)*r), H2 = Math.ceil((h + 2*pad)*r);
    if (!c.tr || c.tr.width !== W2 || c.tr.height !== H2){ c.tr = c.tr || OPTS.canvas(); c.tr.width = W2; c.tr.height = H2; c.trg = c.tr.getContext('2d'); }
    const q = c.trg; q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, W2, H2); q.setTransform(r, 0, 0, r, 0, 0);
    for (let i = 0; i < NC; i++){
      const x0 = i*w/NC, sw = w/NC;
      q.drawImage(im, x0*r, 0, sw*r, h*r, pad + x0, pad + c.col((i + 0.5)/NC, t, c)*h, sw + rec, h);
    }
    const sh = (h + 2*pad)/NR;
    for (let j = 0; j < NR; j++){
      const v = clamp(((j + 0.5)*sh - pad)/h, 0, 1);
      g.drawImage(c.tr, 0, j*sh*r, W2, sh*r, X0 - pad + c.row(v, t, c)*w, Y0 - pad + j*sh, W2/r, sh + rec);
    }
  } else if (c.col){
    for (let i = 0; i < NC; i++){
      const x0 = i*w/NC, sw = w/NC;
      g.drawImage(im, x0*r, 0, sw*r, h*r, X0 + x0, Y0 + c.col((i + 0.5)/NC, t, c)*h, sw + rec, h);
    }
  } else if (c.row){
    for (let j = 0; j < NR; j++){
      const y0 = j*h/NR, sh = h/NR;
      g.drawImage(im, 0, y0*r, w*r, sh*r, X0 + c.row((j + 0.5)/NR, t, c)*w, Y0 + y0, w, sh + rec);
    }
  } else g.drawImage(im, 0, 0, w*r, h*r, X0, Y0, w, h);
}
`];
// remplacements partout : la taille de l'écran (la scène de l'application, pas la fenêtre), les coordonnées du doigt
// (relatives au canvas), les écouteurs de la fenêtre (retirés en sortant)
const PARTOUT = [
  [/\binnerWidth\b/g, "VW()"], [/\binnerHeight\b/g, "VH()"],
  [/\be\.clientX\b/g, "(e.clientX - OPTS.rect().left)"], [/\be\.clientY\b/g, "(e.clientY - OPTS.rect().top)"],
  [/(^|[\s;(])addEventListener\('keydown'/gm, "$1OPTS.on(window, 'keydown'"],
];

export function exportRecif({ log = console.log } = {}) {
  const html = readFileSync(MAQUETTE, "utf8"), empreinte = createHash("sha256").update(html).digest("hex").slice(0, 12);
  const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/); if (!m) throw new Error("export-recif : script de la maquette introuvable");
  let js = m[1];
  // 1. les données, sorties du script ; leurs images, sorties des données
  mkdirSync(OUT_IMG, { recursive: true });
  const ecrits = new Set(), donnees = {}, NOMS = { tiles: "panorama", front: "premier-plan", fish: "poisson", algues: "algue", decorSprites: "flore", largeSprites: "faune", on: "phares", src: null, mask: null };
  const nom = (p) => p.map((x) => (x in NOMS ? NOMS[x] : x)).filter(Boolean).join("-").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const sortir = (v, path) => {
    if (typeof v === "string" && v.startsWith("data:image/")) {
      const [, type, b64] = v.match(/^data:image\/([a-z+]+);base64,(.*)$/), ext = type === "jpeg" ? "jpg" : type.replace("+xml", "");
      const f = `${nom(path)}.${ext}`; if (ecrits.has(f)) throw new Error(`export-recif : deux images nommées ${f}`);
      writeFileSync(join(OUT_IMG, f), Buffer.from(b64, "base64")); ecrits.add(f);
      return `assets/recif/${f}`;
    }
    if (Array.isArray(v)) return v.map((x, i) => sortir(x, [...path, String(i)]));
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, sortir(x, [...path, k])]));
    return v;
  };
  for (const k of DONNEES) {
    const re = new RegExp(`^const ${k} = (\\{.*\\});$`, "m"), d = js.match(re);
    if (!d) throw new Error(`export-recif : données ${k} introuvables`);
    const prefixe = { A: [], SUB: ["sous-marin"], ABYSS_FISH: ["abysses"], LAGON_SPR: ["creature"], CORAIL_SPR: ["creature"], LARGE_SPR: ["creature"], ABYSSES_SPR: ["creature"] }[k];
    donnees[k] = sortir(JSON.parse(d[1]), prefixe);
    js = js.replace(re, `const ${k} = OPTS.donnees.${k};`);
  }
  // la fiche de la maquette (noms et anecdotes) : celle de l'application la remplace
  js = js.replace(/^const FICHES = \{.*\};$/m, "const FICHES = {};");
  for (const f of readdirSync(OUT_IMG)) if (f !== "donnees.json" && !ecrits.has(f)) unlinkSync(join(OUT_IMG, f));
  // les profondeurs du grand large : chacune doit nommer une nageuse de la maquette
  for (const id of Object.keys(PROFONDEURS)) if (!new RegExp(`\\{id:'${id}', x:\\d+, y:\\d+,[^\\n]*ronde:\\{x0:5950`).test(js)) throw new Error(`export-recif : ${id} n'est pas une nageuse du grand large de la maquette`);
  writeFileSync(join(OUT_IMG, "donnees.json"), JSON.stringify({ source: `art/recif-vivant/index.html (empreinte ${empreinte})`, ...donnees, PROFONDEURS }));
  // 2. les raccords
  for (const [a, b, pourquoi] of RETOUCHES) {
    const n = js.split(a).length - 1; if (n !== 1) throw new Error(`export-recif : retouche « ${pourquoi} » : ${n} occurrence(s) au lieu d'une ; la maquette a changé`);
    js = js.replace(a, () => b);
  }
  if (!FICHE[0].test(js)) throw new Error("export-recif : fonction ouvreFiche introuvable"); js = js.replace(FICHE[0], FICHE[1]);
  if (!LAGBLIT[0].test(js)) throw new Error("export-recif : fonction lagBlit introuvable"); js = js.replace(LAGBLIT[0], () => LAGBLIT[1]);
  for (const [re, b] of PARTOUT) js = js.replace(re, b);
  if (/document\.getElementById/.test(js)) throw new Error(`export-recif : un élément de la page de la maquette reste : ${js.match(/document\.getElementById\([^)]*\)/)[0]}`);
  const fin = "\nrequestAnimationFrame(frame);";
  if (!js.endsWith(fin)) throw new Error("export-recif : la fin du script (lancement de l'animation) a changé");
  js = js.slice(0, -fin.length) + "\nRAF = requestAnimationFrame(frame);";
  const module = `// FICHIER GÉNÉRÉ par art/tools/export-recif.mjs depuis art/recif-vivant/index.html (empreinte ${empreinte}) : ne pas
// modifier à la main. Le script de la maquette du récif vivant, tel quel, enveloppé dans startRecif ; ses raccords à
// l'application sont décrits dans l'outil (RETOUCHES). Les images sont dans assets/recif/ (donnees.json).
//
// OPTS : { cv, glc : les deux canvas ; donnees : assets/recif/donnees.json ; owned, brillantes : les créatures (noms de
// la maquette) possédées et brillantes ; size() : { w, h } de la scène en px CSS ; rect() : sa place à l'écran ; dpr() :
// la densité ; on(cible, type, f) : un écouteur à retirer en sortant ; onFiche(id) : une créature touchée ;
// scintille(ctx, c, x0, y0, t, k) : le scintillement d'une brillante ; mesure(t) : appelé à chaque image ;
// arrivee(id, t, x, vue) : la créature qui vient d'être achetée, son décalage et son halo pendant son arrivée ;
// reduite(src, w, h, k) : l'image src déjà réduite pour k px d'écran par px, { img, r }, ou null ; qualite() : { cadence,
// bandes }, l'allègement des créatures ; canvas() : un canvas de travail (rendu en sortant) }
/* eslint-disable */
export function startRecif(OPTS) {
let VIVANT = true, RAF = 0;
const VW = () => OPTS.size().w, VH = () => OPTS.size().h;
${js}
return {
  stop() { VIVANT = false; cancelAnimationFrame(RAF); try { gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch (e) { void e; } },
  resize() { resize(); },
  get camX() { return camX; },
  set camX(x) { camX = x; clampCam(); },
  get vue() { return { sc, viewW, W, H }; },
  get zone() { return zoneName; },
  creatureAt(x, y, tol = 26) { return creatureAt(x, y, tol)?.id ?? null; },
  vivantes() { return lagOrder.map((c) => c.id); },
  aller(id) { const c = lagOrder.find((c) => c.id === id); if (c) { vel = 0; camX = c.x - viewW / 2; clampCam(); } },
  ou(id) { const c = lagOrder.find((c) => c.id === id); return c && c.vis ? { x: (c.cx - camX) * sc / (cv.width / VW()), y: c.cy * sc / (cv.height / VH()) } : null; },
};
}
`;
  mkdirSync(join(APP, "js/recif"), { recursive: true });
  writeFileSync(OUT_JS, module);
  execFileSync(process.execPath, ["--check", OUT_JS]); // (le module se lit)
  const poids = [...ecrits].reduce((s, f) => s + readFileSync(join(OUT_IMG, f)).length, 0);
  log(`récif vivant : ${ecrits.size} images (${(poids / 1048576).toFixed(2)} Mo) -> ${OUT_IMG} ; module ${(module.length / 1024).toFixed(0)} Ko -> ${OUT_JS}`);
  return { images: ecrits.size, poids, empreinte };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) exportRecif();
