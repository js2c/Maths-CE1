// LOT « SUITES DES CORRECTIFS DU 5 NOVEMBRE » (docs/LOTS.md, fiche 23 ; réponses du parent du 6 novembre 2026 aux questions ouvertes
// de la PR #75) : le parcours du lot. Il passe par chaque situation nouvelle et en fait les captures (1280 × 800, 1920 × 1200, la
// tablette de référence s5e, le petit smartphone) :
//  1. les trois compteurs toujours visibles, la réserve arc-en-ciel à 0 comme le diamant : à l'accueil, dans le récif, dans la
//     boutique, pendant une séance (sur une ligne, sans chevauchement, cibles de 64 px) ; la réserve arc-en-ciel à 0 touchée : à quoi
//     elles servent, puis « Viens jouer souvent : tu en gagneras une ! » (aucune phrase nouvelle) ;
//  2. le bouton de l'album, dans le récif : le livre de cartes ; dans l'album, la sortie : le dessin du récif, qui y ramène (les deux
//     boutons capturés de près, à la densité de l'écran).
// La musique d'ambiance (« Les profondeurs ») et la phrase du diamant à 0 ne changent pas : correctifs-5-novembre.mjs les vérifie.
// Captures dans tests/e2e/out/suites-5-novembre/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/suites-5-novembre.mjs [--vite]   (--vite : seulement 1280 × 800)
// BANC ANDROID, raccourcis : voix rapide, sans service worker
// (raison : chaque situation part d'une base neuve ; à la vitesse réelle de la voix le parcours durerait plusieurs fois plus longtemps,
// et installer l'application pour chacune n'apporterait rien à ce qu'il vérifie, l'affichage des compteurs et deux boutons. La vraie
// voix et l'application installée sont éprouvées par journee.mjs, enfant.mjs --android, installation.mjs.)
// (sans le problème du jour, `sans=probleme` : il n'est pas l'objet de ce parcours)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { ilYaSemaines, recifOuvert } from "./recif-commun.mjs";
import { optionsProfil } from "./appareils.mjs";

const args = process.argv.slice(2);
const OUT = resolve("tests/e2e/out/suites-5-novembre"); mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url), "utf8"));
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url), "utf8"));
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [], fail = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) fail.push(msg); };
const Q = "?nosw&voix=rapide&sans=probleme&sansReprise";
const V1280 = ["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }];
const VUES = args.includes("--vite") ? [V1280] : [V1280, ["1920", { viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1, hasTouch: true }], ["s5e", optionsProfil("s5e")], ["petit-smartphone", optionsProfil("petit-smartphone")]];
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
// aucune étoile arc-en-ciel ni de diamant en réserve (une gagnée, une dépensée : l'ouverture d'une zone)
const etoiles = (total) => ({ id: "etoiles", total, cumul: total + 400, dorees: 0, doreesDepensees: 0, arcEnCiel: 1, arcDepensees: 1, arcBrillees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });

async function ouvrir(vue, etat, q = Q) {
  const context = await browser.newContext(vue[1]);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => !!window.__app?.store, null, { timeout: 60000 });
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put("recompenses", r); }, etat);
  await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { context, page };
}
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const shot = async (page, vue, nom, ms = 500) => { await page.waitForTimeout(ms); await page.screenshot({ path: join(OUT, `${nom}-${vue[0]}.png`) }); };
// les boîtes visibles d'un sélecteur, en px logiques de la scène (1280 × 800)
const boites = (page, sel) => page.evaluate((s) => { const ui = document.querySelector("#ui").getBoundingClientRect(), k = ui.width / 1280; return [...document.querySelectorAll(s)].filter((e) => e.checkVisibility({ visibilityProperty: true }) && !e.closest(".stash")).map((e) => { const r = e.getBoundingClientRect(); return { x: (r.x - ui.x) / k, y: (r.y - ui.y) / k, w: r.width / k, h: r.height / k }; }); }, sel);
// la rangée des compteurs : les trois, sur une ligne, sans chevauchement, entre la frise et le bord ; les deux réserves à 0
const rangee = async (page, vue, ou) => {
  const b = [...(await boites(page, ".hud.stars")), ...(await boites(page, ".reserve.arc")), ...(await boites(page, ".reserve.diamant"))];
  const n = await page.evaluate(() => window.__app.hud?.reserves?.n);
  check(b.length === 3 && n?.arc === 0 && n?.diamant === 0, `${vue[0]} ${ou} : les trois compteurs visibles, l'arc-en-ciel et le diamant à 0 (${b.length} ; ${JSON.stringify(n)})`);
  if (b.length !== 3) return;
  check(b.every((x) => Math.abs(x.y - b[0].y) < 1 && Math.abs(x.h - b[0].h) < 1) && b.every((x, i) => !i || x.x >= b[i - 1].x + b[i - 1].w - 0.5) && b[0].x >= 950 && b[2].x + b[2].w <= 1280.5, `${vue[0]} ${ou} : sur une ligne, sans se chevaucher, entre la frise et le bord (${b.map((x) => Math.round(x.x)).join(", ")})`);
  check(b.slice(1).every((x) => x.w >= 64 && x.h >= 64), `${vue[0]} ${ou} : les réserves, cibles d'au moins 64 px`);
};

for (const vue of VUES) {
  const { context, page } = await ouvrir(vue, [owned(lagon.slice(0, 6)), etoiles(123), { id: "quota", date: ilYaSemaines(3), cartes: 6 }]);
  await page.waitForTimeout(1500);
  // ---------------------------------------------------------------- 1. l'accueil : les trois compteurs ; l'arc-en-ciel à 0 touché
  await rangee(page, vue, "accueil");
  await shot(page, vue, "01-accueil-trois-compteurs");
  await page.evaluate(() => { window.__said = []; });
  await tap(page, ".reserve.arc"); await page.waitForTimeout(250);
  await shot(page, vue, "02-arc-en-ciel-a-zero-touche", 0);
  await page.waitForTimeout(500);
  const dit = await page.evaluate(() => window.__said.join(" | "));
  check(dit === `${T.reserves.arcProchainesZones} ${T.reserves.diamantGagner}`, `${vue[0]} l'arc-en-ciel à 0, touché : « ${dit} »`);
  check(!(await page.evaluate(() => { const B = window.__app.bulle, p = B.place?.rect, e = document.querySelector(".reserve.arc"); if (!p || !B.shown) return false; const q = [parseFloat(e.style.left), parseFloat(e.style.top), parseFloat(e.style.left) + parseFloat(e.style.width), parseFloat(e.style.top) + parseFloat(e.style.height)]; return !(p[2] <= q[0] || q[2] <= p[0] || p[3] <= q[1] || q[3] <= p[1]); })), `${vue[0]} la bulle ne couvre pas la réserve touchée`);
  // ---------------------------------------------------------------- 1. le récif : les trois compteurs ; 2. le livre de cartes
  await page.evaluate(() => window.__app.voice.stop());
  await tap(page, ".galet.reefkey"); await page.waitForTimeout(300); if (!(await page.evaluate(() => window.__app.reef?.open))) await tap(page, ".galet.reefkey");
  await recifOuvert(page);
  await rangee(page, vue, "récif");
  const livre = (await boites(page, ".albumkey"))[0], maison = (await boites(page, ".homekey"))[0];
  check(!!livre && !!maison && Math.abs(livre.w - maison.w) < 1 && livre.w >= 64, `${vue[0]} récif : le bouton de l'album (le livre de cartes), à la taille de la maison`);
  await shot(page, vue, "03-recif-livre-de-cartes");
  if (vue[0] === "s5e") await page.locator(".albumkey").screenshot({ path: join(OUT, "05-bouton-livre-de-cartes-s5e.png") });
  await tap(page, ".albumkey"); await page.waitForFunction(() => window.__app.album?.open, null, { timeout: 20000 }); await page.waitForTimeout(1500);
  const sortie = (await boites(page, ".album-retour"))[0];
  check(!!sortie && sortie.w >= 64 && sortie.x < 200 && sortie.y > 560 && (await page.getAttribute(".album-retour", "aria-label")) === "le récif", `${vue[0]} album : la sortie, le dessin du récif, en bas à gauche`);
  await shot(page, vue, "04-album-sortie-recif");
  if (vue[0] === "s5e") await page.locator(".album-retour").screenshot({ path: join(OUT, "06-bouton-sortie-recif-s5e.png") });
  await tap(page, ".album-retour");
  check(await page.waitForFunction(() => !window.__app.album.open && window.__app.reef?.open && !document.querySelector(".album-page"), null, { timeout: 15000 }).then(() => true, () => false), `${vue[0]} album : la sortie ramène au récif`);
  await page.waitForTimeout(1200);
  // ---------------------------------------------------------------- 1. la boutique : les trois compteurs
  await tap(page, ".boutique-cle"); await page.waitForSelector(".boutique-tuile", { timeout: 20000 }); await page.waitForTimeout(1500);
  await rangee(page, vue, "boutique");
  await shot(page, vue, "07-boutique-trois-compteurs");
  // ---------------------------------------------------------------- 1. une séance : les trois compteurs
  await page.goto(url + Q + "&choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.waitForTimeout(800); await tap(page, ".galet.play");
  await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
  await page.waitForTimeout(600);
  await rangee(page, vue, "séance");
  await shot(page, vue, "08-seance-trois-compteurs");
  await context.close();
}

check(!errors.length, `aucune erreur dans la page${errors.length ? ` (${errors.slice(0, 3).join(" | ")})` : ""}`);
await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} ÉCHEC(S)`); process.exitCode = 1; }
