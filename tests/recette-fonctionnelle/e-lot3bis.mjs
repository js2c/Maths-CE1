// LOT 3 BIS · PARTIE E DU MATÉRIEL : les planches des écrans nouveaux ou modifiés par la partie B du lot 3 bis
// (docs/SPEC-LOT3BIS.md, B1 à B11), à partir des captures du parcours `node tests/e2e/lot3bis-b.mjs` (densité 2,
// tests/e2e/out/lot3bis-b/, non versionnées) : planches de 4 (2 × 2), en JPEG qualité 80, chaque capture avec sa
// légende (le constat du rapport qu'elle concerne et ce qu'elle montre). Aucun jugement : le relecteur juge.
//   node tests/e2e/lot3bis-b.mjs && RECETTE_OUT=tests/recette-fonctionnelle/out-lot3bis node tests/recette-fonctionnelle/e-lot3bis.mjs
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, ROOT } from "./commun.mjs";

const SRC = join(ROOT, "tests/e2e/out/lot3bis-b"), DIR = join(OUT, "E-lot3bis"); mkdirSync(DIR, { recursive: true });
// thème -> [fichier, légende]
const THEMES = [
  ["E01-choisir", "B1 (R15) · les écrans de niveaux de « choisir »", [
    ["B1-ligne-1280x800", "ligne graduée : 13 plaques numérotées, 4 colonnes, lueur du conseillé"], ["B1-additions-1280x800", "additions : 7 plaques numérotées"],
    ["B1-calcul-1280x800", "calcul rapide : 9 plaques sur le chemin de cailloux ; niveaux 1 à 3 validés (étoile dans la plaque), conseillé 6"], ["B1-lecons-1280x800", "leçons"],
    ["B1-ligne-1920x1200", "ligne graduée, format 1920 × 1200"], ["B1-calcul-1340x800", "calcul rapide, format 1340 × 800"], ["B1-calcul-zoom", "agrandissement : plaque validée et lueur"], ["B1-ligne-zoom", "agrandissement : plaque 1 (conseillée)"]]],
  ["E02-legende", "B2 · la légende des niveaux (pour le parent)", [
    ["B2-legende-ligne", "ligne graduée (haut du tableau)"], ["B2-legende-ligne-bas", "ligne graduée, tableau défilé jusqu'en bas"], ["B2-legende-additions", "additions"], ["B2-legende-calcul", "calcul rapide"], ["B2-legende-lecons", "leçons"]]],
  ["E03-appui-long", "B3 · l'appui long (0,8 s) sur les pictogrammes : l'étiquette, rien de lancé", [
    ["B3-appui-jouer", "accueil : jouer"], ["B3-appui-choisir", "accueil : choisir"], ["B3-appui-recif", "accueil : le récif"], ["B3-appui-album", "accueil : l'album"],
    ["B3-appui-ligne", "« choisir » : la ligne"], ["B3-appui-additions", "« choisir » : les additions"], ["B3-appui-calcul", "« choisir » : le calcul rapide"], ["B3-appui-lecons", "« choisir » : les leçons"]]],
  ["E04-calcul", "B4 (R6, R7, R8, R20) · calcul rapide : aides, corrections, calculs guidés", [
    ["B4-annonce-mur", "annonce aux niveaux du mur : le mur et le poisson pendant « Le petit poisson va t'aider »"], ["B4-aide-mur-2", "niveau 2, coquillage : le poisson fait le premier pas (« Moins dix : le poisson monte d'une rangée »)"],
    ["B4-aide-mur-2-apres", "niveau 2, après l'aide : le pavé revient, le chemin en petit"], ["B4-correction-mur-2", "niveau 2, correction au mur : la bonne réponse entourée"],
    ["B4-aide-mur-6", "niveau 6, coquillage (mur)"], ["B4-correction-mur-6", "niveau 6, correction au mur"], ["B4-aide-chemin-1", "niveau 1, coquillage (« On part de … Suis le pont. »)"], ["B4-aide-chemin-7", "niveau 7, coquillage (« D'abord, on va jusqu'à … »)"],
    ["B4-correction-chemin-7", "niveau 7, erreur C4 : bonne réponse entourée, ponts rejoués"], ["B4-correction-chemin-9", "niveau 9, erreur C5"], ["B4-guide-7-etape1", "niveau 7, calcul guidé : l'ardoise garde le calcul demandé"], ["B4-guide-7-correction", "niveau 7, erreur sur un caillou : le pont rejoué"],
    ["B4-guide-7-fin", "niveau 7 : le résultat écrit dans la bulle à la fin"], ["B4-guide-9-etape1", "niveau 9, calcul guidé"], ["B4-guide-9-correction", "niveau 9, « je ne sais pas » sur un caillou"], ["B4-guide-9-fin", "niveau 9, fin"]]],
  ["E05-additions", "B5 (R5) · les aides des additions", [
    ["B5-aide-f1-directe-a", "famille 1, « 8 + 2 » : la tortue fait les sauts"], ["B5-aide-f1-trou-a", "famille 1, « ? + 8 = 10 » : la tortue saute jusqu'à 10, « Hop ! », sans dire le nombre de sauts"],
    ["B5-aide-f4-directe-a", "famille 4, « 4 + 3 » : les poissons dans leurs pièces"], ["B5-aide-f4-directe-b", "famille 4 : les poissons rangés sous le toit"], ["B5-aide-f4-trou-a", "famille 4, « 4 + ? = 7 »"], ["B5-aide-f4-trou-b", "famille 4, à trou : les places vides allumées sous le toit"],
    ["B5-aide-f5-directe-b", "famille 5, « 5 + 3 » : la maison et le cadre de 10"], ["B5-aide-f5-trou-b", "famille 5, « ? + 3 = 9 » : places vides sous le toit et dans le cadre"]]],
  ["E06-fins", "B6 (R13, R14, R24) · les fins de séquence", [
    ["B6-etoiles-arc-posees", "trois étoiles arc-en-ciel, une seule phrase au pluriel"], ["B6-etoiles-arc-vol", "elles volent vers l'album ; les étoiles de mer volent du compteur au coquillage"], ["B6-coquillage-a-toucher", "le coquillage, à toucher aussitôt"]]],
  ["E07-placer", "B7 (R16) · « placer » et « estimer » : le nombre sur l'étiquette du poisson", [
    ["B7-placer-2-debut", "niveau 2, début de la question"], ["B7-placer-2-glisse", "niveau 2, le poisson glissé"], ["B7-placer-9-debut", "niveau 9"], ["B7-placer-9-pose", "niveau 9, posé sur 200"], ["B7-estimer-8-debut", "niveau 8, « estimer »"], ["B7-estimer-8-pose", "niveau 8, posé"]]],
  ["E08-lecons", "B9 (R18) · les leçons L2, L8, L9, une capture par phrase (voix réelle)", [
    ...Array.from({ length: 9 }, (_, i) => [`B9-L2-0${i + 1}`, `L2, phrase ${i + 1}`]), ...Array.from({ length: 10 }, (_, i) => [`B9-L8-${String(i + 1).padStart(2, "0")}`, `L8, phrase ${i + 1}`]), ...Array.from({ length: 7 }, (_, i) => [`B9-L9-0${i + 1}`, `L9, phrase ${i + 1}`])]],
  ["E09-parent", "B10 (R19) · l'espace parent (base « un mois »)", [
    ["B10-parent-familles", "familles : « acquise le … (depuis, n sur m) »"], ["B10-parent-journal", "journal des erreurs : en phrases, erreurs d'additions détaillées"], ["B10-parent-legende", "les niveaux de « choisir », en bref"]]],
  ["E10-cosmetique", "B11 (R20 à R23) · cosmétique", [
    ["B11-accueil", "accueil : les bulles hors du rocher"], ["B11-album", "album : les médaillons de zone"], ["B11-pause-reecouter", "pause : « réécouter » visible et qui répond"], ["B11-bernard", "additions : le bernard-l'ermite entier"],
    ["B11-bulles-centaines", "niveau 9 : « 400 », « 500 », « 600 » dans leurs bulles"], ["B11-L1-04", "L1 : « rejouer » sous « passer »"], ["B11-L10-14", "L10 : chaluts"], ["B11-L10-16", "L10 : 307, rien sur le rocher, plaque sous le nombre"], ["R12-reprise-calcul-guide", "R12 : reprise d'un calcul guidé après une visite du récif (« On continue ! Plus 1 ? »)"]]],
];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
const lignes = ["# Partie E · les écrans du lot 3 bis", "", "Planches des écrans nouveaux ou modifiés par la partie B du lot 3 bis, d'après le parcours `tests/e2e/lot3bis-b.mjs` (captures en densité 2, réduites). Légende : le constat du rapport concerné, puis ce que montre la capture.", ""];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const [id, titre, items] of THEMES) {
  const ok = items.filter(([f]) => existsSync(join(SRC, `${f}.png`)));
  const missing = items.filter(([f]) => !existsSync(join(SRC, `${f}.png`))).map(([f]) => f);
  lignes.push(`## ${titre}`, "");
  for (let p = 0; p * 4 < ok.length; p++) {
    const four = ok.slice(p * 4, p * 4 + 4), name = `${id}-${String(p + 1).padStart(2, "0")}.jpg`;
    const cells = four.map(([f, leg], i) => `<figure><img src="data:image/png;base64,${readFileSync(join(SRC, `${f}.png`)).toString("base64")}"><figcaption><b>${p * 4 + i + 1}</b> · ${esc(leg)}</figcaption></figure>`).join("");
    await page.setContent(`<body style="margin:0;background:#fff;font:15px sans-serif"><h3 style="margin:8px 10px">${esc(titre)} · planche ${p + 1}</h3><div style="display:grid;grid-template-columns:640px 640px;gap:8px;padding:0 8px 8px">${cells}</div><style>figure{margin:0;border:1px solid #ccc}img{width:640px;height:400px;display:block}figcaption{padding:4px 6px;min-height:36px}</style></body>`);
    await page.waitForFunction(() => [...document.images].every((i) => i.complete));
    await page.screenshot({ path: join(DIR, name), type: "jpeg", quality: 80, fullPage: true });
    lignes.push(`- \`E-lot3bis/${name}\` : ${four.map(([, leg], i) => `n° ${p * 4 + i + 1} ${leg}`).join(" ; ")}`);
  }
  if (missing.length) lignes.push(`- captures absentes (partie du parcours non relancée) : ${missing.join(", ")}`);
  lignes.push("");
}
writeFileSync(join(DIR, "INDEX.md"), lignes.join("\n"));
await browser.close();
console.log(`planches écrites dans ${DIR}`);
