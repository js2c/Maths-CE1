// CE QUI NE SERT PLUS (lot « Recette de l'enfant et nettoyage des couches », point 1 ; docs/COUCHES.md). Réunit les relevés de
// couverture des parcours (tests/e2e/navigateur.mjs, COUVERTURE=dossier) et ceux de Node (NODE_V8_COVERAGE=dossier : tests
// unitaires, simulations), et écrit le bilan :
//  - pour chaque fichier JavaScript de app/js/ : la part exécutée, et chaque morceau jamais exécuté de plus de `--min`
//    caractères (80 par défaut), avec ses lignes et sa première ligne ;
//  - les fichiers de app/ jamais demandés par une page (d'après la liste du mode hors ligne, app/sw-files.json) ;
//  - les images des planches (app/assets/art/atlas.json) jamais dessinées ;
//  - les règles CSS jamais utilisées.
// Un morceau jamais exécuté n'est pas forcément mort : un cas rare, une erreur, un réglage du parent. Chacun est jugé dans
// docs/COUCHES.md : retiré, ou gardé avec sa raison.
//   node tools/couverture.mjs dossier… [--min 80] [--sortie bilan.md]
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const MIN = Number(opt("--min", 80)), SORTIE = opt("--sortie", null);
const dossiers = args.filter((a, i) => !a.startsWith("--") && !(i && args[i - 1].startsWith("--")));
const APP = resolve(new URL("../app/", import.meta.url).pathname);
// le chemin d'un script, ramené à app/ : « /js/main.js », « /Maths-CE1/js/main.js », « file:///…/app/js/main.js »
const relatif = (u) => { const m = /\/app\/(.+)$/.exec(u) ?? /\/(js\/.+|css\/.+)$/.exec(u); return m ? m[1] : null; };

const couvert = new Map(), demandes = new Set(), sprites = new Set(), cssUtilise = new Map();
let pages = 0, runsNode = 0;
// un relevé V8 d'un script : les plages imbriquées, appliquées de la plus large à la plus fine ; un caractère est exécuté si sa
// plage la plus fine a été parcourue au moins une fois
function appliquer(fichier, functions) {
  if (!fichier || !fichier.startsWith("js/")) return;
  const chemin = join(APP, fichier); if (!existsSync(chemin)) return;
  const n = readFileSync(chemin, "utf8").length, b = (couvert.get(fichier) ?? couvert.set(fichier, new Uint8Array(n)).get(fichier));
  const plages = functions.flatMap((f) => f.ranges).sort((a, c) => a.startOffset - c.startOffset || c.endOffset - a.endOffset);
  const ici = new Int32Array(n).fill(-1);
  for (const r of plages) ici.fill(r.count > 0 ? 1 : 0, Math.max(0, r.startOffset), Math.min(n, r.endOffset));
  for (let i = 0; i < n; i++) if (ici[i] === 1) b[i] = 1;
}
for (const d of dossiers) for (const f of readdirSync(d).filter((x) => x.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(join(d, f), "utf8"));
  if (j.result) { runsNode++; for (const s of j.result) appliquer(relatif(s.url), s.functions); continue; } // NODE_V8_COVERAGE
  pages++;
  for (const s of j.js ?? []) appliquer(relatif(s.url), s.functions);
  for (const u of j.fichiers ?? []) { const r = /\/(?:Maths-CE1\/)?(.*)$/.exec(u)?.[1]; if (r !== undefined) demandes.add(r.split("?")[0]); }
  for (const n of j.sprites ?? []) sprites.add(n);
  for (const c of j.css ?? []) { const r = relatif(c.url); if (!r) continue; const l = cssUtilise.get(r) ?? cssUtilise.set(r, []).get(r); l.push(...c.ranges); }
}

const out = [`# Bilan de couverture`, ``, `${pages} pages de parcours, ${runsNode} relevés de Node (tests unitaires, simulations).`, ``];
// 1. le JavaScript
const tous = [];
const lister = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? lister(join(d, e.name)) : e.name.endsWith(".js") ? [join(d, e.name)] : []));
for (const f of lister(join(APP, "js"))) tous.push(f.slice(APP.length + 1));
out.push(`## JavaScript : part exécutée, et morceaux jamais exécutés de plus de ${MIN} caractères`, ``);
const lignes = [];
for (const f of tous.sort()) {
  const src = readFileSync(join(APP, f), "utf8"), b = couvert.get(f);
  if (!b) { lignes.push(`- **${f}** : jamais chargé`); continue; }
  // les blancs et les commentaires ne comptent pas
  const code = (i) => !/\s/.test(src[i]);
  let tot = 0, ex = 0; for (let i = 0; i < src.length; i++) if (code(i)) { tot++; if (b[i]) ex++; }
  // (les modules générés par l'atelier ne se retouchent pas à la main : seulement leur part exécutée)
  const genere = /^js\/(art\/runtime|recif\/recif-vivant|voiliers\/voiliers-scene|etal\/etal-scene)\.js$/.test(f), morceaux = [];
  for (let i = 0; i < src.length && !genere;) {
    if (b[i] || !code(i)) { i++; continue; }
    let j = i; while (j < src.length && !b[j]) j++;
    const txt = src.slice(i, j), utile = txt.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
    if (utile.length >= MIN) { const l0 = src.slice(0, i).split("\n").length, l1 = l0 + txt.split("\n").length - 1; morceaux.push(`  - lignes ${l0}${l1 > l0 ? `-${l1}` : ""} (${utile.length} car.) : \`${txt.trim().split("\n")[0].slice(0, 110).replace(/`/g, "'")}\``); }
    i = j;
  }
  lignes.push(`- **${f}** : ${Math.round((100 * ex) / tot)} % exécuté${genere ? " (généré par l'atelier)" : ""}${morceaux.length ? ` ; ${morceaux.length} morceau(x) jamais exécuté(s)` : ""}`, ...morceaux);
}
out.push(...lignes, ``);
// 2. les fichiers jamais demandés
if (pages) {
  const sw = JSON.parse(readFileSync(join(APP, "sw-files.json"), "utf8")).files.filter((f) => f !== "./");
  // (les voix et les cartes : une par phrase et par créature ; seulement le nombre)
  const jamais = sw.filter((f) => !demandes.has(f) && !(f.startsWith("assets/art/") && /@1x/.test(f)));
  const groupe = (re) => jamais.filter((f) => re.test(f));
  out.push(`## Fichiers de app/ jamais demandés par une page`, ``, `${jamais.length} sur ${sw.length} (hors planches @1x, les pages étant en densité 1 à 2,25 : voir la note de COUCHES.md).`, ``,
    `- voix : ${groupe(/^assets\/voix\//).length} (une par phrase ; seules les phrases dites sont demandées)`,
    `- illustrations des cartes : ${groupe(/^assets\/cards\//).length}`,
    `- autres :`, ...jamais.filter((f) => !/^assets\/(voix|cards)\//.test(f)).map((f) => `  - ${f}`), ``);
  // 3. les images des planches
  const atlas = JSON.parse(readFileSync(join(APP, "assets/art/atlas.json"), "utf8"));
  const noms = Object.keys(atlas.sprites), pasVus = noms.filter((n) => !sprites.has(n));
  out.push(`## Images des planches jamais dessinées (sprites.frame)`, ``, `${pasVus.length} sur ${noms.length}.`, ``, ...pasVus.map((n) => `- ${n} (planche « ${atlas.sprites[n].sheet ?? "?"} »)`), ``);
  // 4. les règles CSS
  out.push(`## Règles CSS jamais utilisées`, ``);
  for (const [f, ranges] of cssUtilise) {
    const src = readFileSync(join(APP, f), "utf8"), u = new Uint8Array(src.length);
    for (const r of ranges) u.fill(1, r.start, r.end);
    // chaque règle de premier niveau (sélecteur { … }) hors @keyframes, @font-face, @media (leurs règles internes comptent)
    const re = /(^|\})\s*([^{}@][^{}]*)\{[^{}]*\}/g; let m; const morte = [];
    while ((m = re.exec(src))) { const deb = m.index + m[1].length, sel = m[2].trim(); if (!u.slice(deb, re.lastIndex).some(Boolean) && !/^(from|to|\d+%)/.test(sel)) morte.push(`- \`${sel.replace(/\s+/g, " ").slice(0, 140)}\` (ligne ${src.slice(0, deb).split("\n").length})`); re.lastIndex--; }
    out.push(`### ${f}`, ``, ...(morte.length ? morte : ["(toutes utilisées)"]), ``);
  }
}
const texte = out.join("\n") + "\n";
if (SORTIE) writeFileSync(SORTIE, texte); else process.stdout.write(texte);
