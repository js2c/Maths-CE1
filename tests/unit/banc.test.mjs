// LE BANC ANDROID, LES RACCOURCIS DÉCLARÉS (lot « Banc Android et recette en conditions réelles », point 2 ; docs/LOTS.md,
// fiche 13). Les parcours tournent par défaut dans les conditions d'un vrai Android (tests/e2e/appareils.mjs, navigateur.mjs) :
// la vraie voix, le vrai son, la lecture automatique refusée, le service worker. Un parcours peut garder un raccourci, mais il
// le déclare en tête de son fichier, avec sa raison :
//   // BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
//   // (raison : …)
// Ce test liste les raccourcis de chaque parcours et échoue si un fichier en prend un qu'il ne déclare pas, ou sans raison écrite.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// les raccourcis reconnus, et ce qui les trahit dans le code d'un parcours
export const RACCOURCIS = {
  "voix rapide": /voix=rapide/,
  "sans service worker": /[?&"'`]nosw\b|serviceWorkers:\s*["']block/,
  "son coupé": /son=non/,
  "lecture automatique permise": /no-user-gesture-required/,
  "lecteurs de médias non limités": /max-web-media-player-count=(?:\d{2,}|9)\b/,
};
const DOSSIERS = ["tests/e2e", "tests/recette-fonctionnelle"];
const fichiers = DOSSIERS.flatMap((d) => readdirSync(d).filter((f) => f.endsWith(".mjs")).map((f) => join(d, f)));
// la déclaration : la ligne « BANC ANDROID, raccourcis : … » et, juste après, « (raison : …) » sur une ou plusieurs lignes
export function declaration(src) {
  const m = /^\/\/ BANC ANDROID, raccourcis : (.+)$/m.exec(src);
  if (!m) return null;
  const apres = src.slice(m.index + m[0].length).split("\n").slice(1);
  const lignes = []; for (const l of apres) { if (!l.startsWith("//")) break; lignes.push(l.replace(/^\/\/\s?/, "")); if (/\)\s*$/.test(l)) break; }
  const raison = /^\(raison : ([\s\S]+)\)$/.exec(lignes.join(" ").trim())?.[1]?.trim() ?? "";
  return { raccourcis: m[1].split(/,\s*/).map((s) => s.trim()).filter(Boolean), raison };
}
// les raccourcis pris par le code (les lignes de commentaires ne comptent pas)
export const pris = (src) => { const code = src.split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n"); return Object.keys(RACCOURCIS).filter((k) => RACCOURCIS[k].test(code)); };

test("chaque raccourci d'un parcours est déclaré en tête de son fichier, avec sa raison", () => {
  const liste = [], fautes = [];
  for (const f of fichiers) {
    const src = readFileSync(f, "utf8"), p = pris(src), d = declaration(src);
    if (!p.length && !d) continue;
    liste.push(`${f} : ${p.join(", ") || "(aucun)"}`);
    if (!d) { fautes.push(`${f} : prend ${p.join(", ")} sans le déclarer (« // BANC ANDROID, raccourcis : … » puis « // (raison : …) »)`); continue; }
    for (const k of d.raccourcis) if (!(k in RACCOURCIS)) fautes.push(`${f} : raccourci inconnu « ${k} » (${Object.keys(RACCOURCIS).join(", ")})`);
    for (const k of p) if (!d.raccourcis.includes(k)) fautes.push(`${f} : prend « ${k} » sans le déclarer`);
    if (d.raison.length < 30) fautes.push(`${f} : la raison des raccourcis n'est pas écrite (« (raison : …) », au moins une phrase)`);
  }
  console.log(`les parcours qui gardent un raccourci (${liste.length}) :\n  ${liste.join("\n  ")}`);
  assert.deepEqual(fautes, []);
});

test("le banc par défaut : navigateur.mjs lance Chromium dans les conditions d'Android", () => {
  const nav = readFileSync("tests/e2e/navigateur.mjs", "utf8"), app = readFileSync("tests/e2e/appareils.mjs", "utf8");
  assert.match(app, /--autoplay-policy=user-gesture-required/, "la lecture automatique refusée");
  assert.match(app, /--max-web-media-player-count=\$\{limite\}/, "les lecteurs de médias limités");
  assert.match(app, /LECTEURS_MAX = 8\b/, "8 lecteurs de médias");
  assert.match(nav, /ARGS_ANDROID/, "navigateur.mjs prend les réglages du banc");
  for (const p of ["s5e", "tablette-entree", "smartphone", "petit-smartphone"]) assert.match(app, new RegExp(`["']?${p}["']?: \\{ nom:`), `le profil ${p}`);
});

test("la déclaration se lit (exemple)", () => {
  const d = declaration("// TITRE\n// BANC ANDROID, raccourcis : voix rapide, son coupé\n// (raison : un exemple assez long pour être une raison écrite.)\nimport x from 'y';");
  assert.deepEqual(d.raccourcis, ["voix rapide", "son coupé"]);
  assert.match(d.raison, /exemple/);
  assert.deepEqual(pris(`const Q = "?nosw&voix=rapide&son=non";\n// voix=rapide en commentaire`), ["voix rapide", "sans service worker", "son coupé"]);
});

test("le stockage plein : dit au parent tant qu'aucune installation n'a réussi depuis (engine/stockage.js)", async () => {
  const { stockagePlein, texteStockage } = await import("../../app/js/engine/stockage.js");
  const sw = (message, extra = {}) => ({ source: "service worker", type: "service worker", message, ...extra });
  assert.equal(stockagePlein([]), null);
  assert.equal(stockagePlein([sw("installation finie")]), null);
  const d = stockagePlein([sw("installation finie"), { source: "page", message: "application lancée" }, sw("stockage plein", { besoinMo: 135, libreMo: 60 })]);
  assert.equal(d.message, "stockage plein");
  assert.equal(stockagePlein([sw("stockage plein"), sw("installation finie"), sw("version activée")]), null, "une installation réussie ensuite : plus d'avis");
  assert.match(texteStockage(d), /il faut 135 Mo, il reste 60 Mo/);
  assert.match(texteStockage(d), /tant que le Wi-Fi est là/);
  assert.match(texteStockage(d), /libérez au moins 90 Mo/);
  assert.match(texteStockage(d), /disparaîtra de lui-même/);
  assert.match(texteStockage(d, { controlee: true }), /version déjà installée continue de marcher/);
});
