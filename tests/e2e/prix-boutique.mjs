// LES PRIX DE LA BOUTIQUE RÉGLABLES (lot « Prix de la boutique réglables », décision du parent du 2 novembre 2026) dans
// Chromium, tactile, voix accélérée. Il passe par chaque situation nouvelle et en fait les captures, en 1280 × 800, 1920 × 1200,
// sur la tablette de référence (s5e) et sur le petit smartphone :
//  1. l'espace parent, Réglages : « Prix de la boutique », trois choix, chacun avec ses prix et ce qu'il suppose ; le niveau par
//     défaut (« Prix pour 2 séances par semaine ») choisi ; les cibles d'au moins 64 px ;
//  2. un toucher sur « 3 séances par semaine » : enregistré, les prix changent aussitôt (Rewards), les étoiles restent ;
//     le bloc « Cartes et boutique » dit les nouveaux prix ;
//  3. la boutique ensuite : les tuiles et la mascotte disent les prix du niveau (70, 175 ; « faire briller » 250) ;
//  4. en mode Libre aussi, au niveau « 4 séances par semaine » ; le retour aux prix d'avant, étoiles inchangées.
// Captures dans tests/e2e/out/prix-boutique/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/prix-boutique.mjs [--out dossier] [--vite]   (--vite : seulement 1280 × 800)
// BANC ANDROID, raccourcis : voix rapide, sans service worker
// (raison : ce parcours vérifie un réglage de l'espace parent et les prix qu'il donne à la boutique, chaque vue sur une base
// neuve : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application pour chaque vue
// n'apporterait rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur le banc Android
// (journee.mjs, enfant.mjs --android, installation.mjs, veille.mjs).)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";
import { optionsProfil } from "./appareils.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/prix-boutique")); mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))), T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const N = Object.fromEntries(cartes.boutique.niveauxPrix.map((x) => [x.id, x]));
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id), rarete = (id) => cartes.cartes.find((c) => c.id === id).rarete;
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const Q = "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=2&guides=0";
const VUES = args.includes("--vite") ? [["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }]]
  : [["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }], ["1920", { viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1, hasTouch: true }], ["s5e", optionsProfil("s5e")], ["petit-smartphone", optionsProfil("petit-smartphone")]];

// une page neuve, un état posé dans la base (fiches du magasin « recompenses »), puis rechargée
async function fresh(state, vue) {
  const context = await browser.newContext(vue[1]), page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put("recompenses", r); }, state);
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { context, page };
}
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
const etoiles = (total) => ({ id: "etoiles", total, cumul: total + 100, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });
const tap = async (page, sel) => { await page.locator(sel).first().evaluate((el) => el.closest(".pa-main") && el.scrollIntoView({ block: "center" })); await page.waitForTimeout(100); const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const parent = async (page, tab) => { await page.evaluate(async (tab) => { const p = window.__app.parent; p.tab = tab; p.open(); await p.dashboard(); }, tab); await page.waitForTimeout(500); };
const fermer = (page) => page.evaluate(() => window.__app.parent.close?.());
const pressed = (row) => row.locator('.pa-prix-choix[aria-pressed="true"]').getAttribute("data-v");
// (relecture du lot, constat 10) ce que voit le parent : le bloc amené en haut de la zone qui défile (sous l'en-tête fixe de
// l'espace parent), capture de l'écran ; s'il est plus haut que la zone visible, une seconde capture, la suite
const montrer = async (page, loc, nom) => {
  const h = await loc.evaluate((el) => { el.scrollIntoView({ block: "start" }); const m = el.closest(".pa-main"); return [el.getBoundingClientRect().height, m ? m.clientHeight : innerHeight]; });
  await page.waitForTimeout(150); await page.screenshot({ path: join(OUT, `${nom}.png`) });
  if (h[0] > h[1]) { await loc.evaluate((el, d) => el.closest(".pa-main")?.scrollBy(0, d), h[1] - 40); await page.waitForTimeout(150); await page.screenshot({ path: join(OUT, `${nom}-suite.png`) }); }
};
const sp = (t) => t.replace(/\u00a0/g, " ");

for (const vue of VUES) {
  const v = vue[0], tout = v === "1280";
  // 6 créatures du lagon dans le récif, 260 étoiles ; la base des arrivages posée aujourd'hui à 9 arrivées (au moins 3 créatures
  // à vendre, quelle que soit la date : une base dans le passé tomberait parfois dans des vacances, qui n'apportent rien)
  const { context, page } = await fresh([owned(lagon.slice(0, 6)), etoiles(260), { id: "quota", date: Date.now(), cartes: 9 }], vue);
  // 1. l'espace parent, Réglages
  await parent(page, "donnees");
  const row = page.locator(".pa-setting", { hasText: "Prix de la boutique" });
  check(await row.count() === 1, `${v} : réglages, « Prix de la boutique »`);
  await montrer(page, row, `01-reglage-defaut-${v}`);
  const choix = await row.locator(".pa-prix-choix").evaluateAll((bs) => bs.map((b) => ({ v: b.dataset.v, t: b.textContent.replace(/\u00a0/g, " "), x: b.getBoundingClientRect().x, h: b.getBoundingClientRect().height, w: b.getBoundingClientRect().width })));
  check(choix.map((c) => c.v).join() === "2,3,4", `${v} : trois choix (${choix.map((c) => c.v).join()})`);
  check(choix.every((c) => c.h >= 64 && c.w >= 64), `${v} : chaque choix fait au moins 64 px (${choix.map((c) => `${Math.round(c.w)}×${Math.round(c.h)}`).join(", ")})`);
  check(choix.every((c) => { const n = N[c.v]; return c.t.includes(n.nom) && c.t.includes(n.suppose) && c.t.includes(`${n.prix.commune} ★`) && c.t.includes(`${n.prix.rare} ★`); }), `${v} : chaque choix dit son nom, ses prix et ce qu'il suppose`);
  check(await pressed(row) === "2", `${v} : par défaut, « Prix pour 2 séances par semaine »`);
  check(await row.locator('.pa-prix-choix[aria-pressed="true"] b').evaluate((b) => getComputedStyle(b, "::before").content.includes("✓")), `${v} : le choix en cours est coché (pas seulement la couleur)`);
  if (v === "petit-smartphone") check(new Set(choix.map((c) => Math.round(c.x))).size === 1, `${v} : un choix par ligne`);
  const largeur = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  check(largeur[0] <= largeur[1], `${v} : pas de défilement horizontal (${largeur.join(" / ")})`);
  // 2. un toucher sur « 3 séances par semaine »
  await tap(page, '.pa-prix-choix[data-v="3"]'); await page.waitForTimeout(300);
  await montrer(page, row, `02-reglage-3-seances-${v}`);
  const apres = await page.evaluate(() => ({ s: null, n: window.__app.rewards.boutique.niveau, total: window.__app.rewards.total }));
  apres.s = await page.evaluate(() => window.__app.store.setting("boutiquePrix"));
  check(apres.s === "3" && apres.n === "3" && apres.total === 260 && await pressed(row) === "3", `${v} : un toucher : enregistré, les prix du niveau 3 tout de suite, les étoiles restent (${JSON.stringify(apres)})`);
  check(/Enregistré/.test(await row.textContent()) && await row.locator(".pa-ok").isVisible(), `${v} : « Enregistré » s'écrit`);
  if (tout) {
    await parent(page, "progression");
    const box = page.locator(".pa-card-box", { has: page.locator("h2", { hasText: /^Cartes et boutique$/ }) });
    await montrer(page, box, `03-cartes-et-boutique-${v}`);
    const t = sp(await box.textContent());
    check(t.includes(`${N[3].prix.commune} étoiles une créature commune, ${N[3].prix.rare} une rare ; ${N[3].briller.commune} et ${N[3].briller.rare}`) && /3 séances par semaine/.test(t), "le bloc « Cartes et boutique » dit les prix du niveau choisi");
  }
  await fermer(page); await page.waitForTimeout(400);
  // 3. la boutique ensuite
  {
    await tap(page, ".reefkey"); await recifOuvert(page); await page.waitForSelector(".boutique-cle", { timeout: 20000 });
    await tap(page, ".boutique-cle");
    await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 }); await page.waitForTimeout(2000);
    const vit = await page.evaluate(() => Object.fromEntries(window.__app.boutique.vit)), aVendre = Object.keys(vit).find((k) => vit[k] === "vendre"), terne = Object.keys(vit).find((k) => vit[k] === "terne");
    await page.evaluate(() => { window.__said = []; });
    await tap(page, `.boutique-tuile[data-id="${aVendre}"]`); await page.waitForTimeout(1500);
    await page.screenshot({ path: join(OUT, `04-boutique-3-seances-${v}.png`) });
    const p3 = N[3].prix[rarete(aVendre)];
    check((await said(page)).includes(T.boutique.prix.replace("{n}", p3)), `${v} : la mascotte dit le prix du niveau 3 (${p3} ; ${await said(page)})`);
    await tap(page, ".boutique-conf.croix"); await page.waitForTimeout(400);
    await page.evaluate(() => { window.__said = []; });
    await tap(page, `.boutique-tuile[data-id="${terne}"]`); await page.waitForTimeout(1500);
    const b3 = N[3].briller[rarete(terne)];
    // (lot « Réserves d'étoiles et étoiles arc-en-ciel » : les phrases courtes, « Pour le faire briller : 250 étoiles. »)
    check((await said(page)).includes(T.boutique[cartes.cartes.find((c) => c.id === terne).genre === "f" ? "brillerLa" : "brillerLe"].replace("{n}", b3)), `${v} : faire briller : le prix du niveau 3 (${b3})`);
    if (tout) await page.screenshot({ path: join(OUT, `05-briller-3-seances-${v}.png`) });
    // un achat paie le prix du niveau
    if (tout) {
      await tap(page, ".boutique-conf.croix"); await page.waitForTimeout(300);
      await tap(page, `.boutique-tuile[data-id="${aVendre}"]`); await page.waitForTimeout(1200); await tap(page, ".boutique-conf.coche");
      await page.waitForFunction(() => !window.__app.boutique.verrou, null, { timeout: 30000 });
      const r = await page.evaluate(() => [window.__app.rewards.total, window.__app.rewards.achats.liste.at(-1)?.prix]);
      check(r[0] === 260 - p3 && r[1] === p3, `un achat paie ${p3} étoiles (${r.join(" ; ")})`);
    }
  }
  // 4. en mode Libre, au niveau 4 ; puis le retour aux prix d'avant
  if (tout) {
    await page.evaluate(async () => { await window.__app.rewards.setMode("libre"); });
    await parent(page, "donnees");
    const row2 = page.locator(".pa-setting", { hasText: "Prix de la boutique" });
    await row2.scrollIntoViewIfNeeded(); await tap(page, '.pa-prix-choix[data-v="4"]'); await page.waitForTimeout(300);
    const rare = lagon.find((id) => rarete(id) === "rare"), t0 = await page.evaluate(() => window.__app.rewards.total);
    const c4 = await page.evaluate((id) => [window.__app.rewards.mode, window.__app.rewards.cout(id, "vendre")], rare);
    check(c4[0] === "libre" && c4[1] === N[4].prix.rare, `en mode Libre, le niveau 4 vaut aussi (${c4.join(" ; ")})`);
    await tap(page, '.pa-prix-choix[data-v="2"]'); await page.waitForTimeout(300);
    const c2 = await page.evaluate((id) => [window.__app.rewards.cout(id, "vendre"), window.__app.rewards.total], rare);
    check(c2[0] === N[2].prix.rare && c2[1] === t0, `le retour aux prix pour 2 séances : ${c2[0]} une rare, étoiles inchangées (${c2[1]})`);
    await montrer(page, row2, `06-reglage-retour-${v}`);
    // relu après un rechargement
    await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
    check(await page.evaluate(() => window.__app.rewards.boutique.niveau) === "2", "après un rechargement, le niveau choisi est gardé");
  }
  await context.close();
}
check(errors.length === 0, `aucune erreur dans la page${errors.length ? ` : ${errors.slice(0, 3).join(" ; ")}` : ""}`);
await browser.close(); srv.close();
