// LE NAVIGATEUR DES PARCOURS (lot « Correctifs de la tablette », point 5 : « +10 » dit par l'ancienne voix). Tous les parcours
// (tests/e2e/*.mjs, tests/recette-fonctionnelle/) lancent Chromium par ce module au lieu de playwright-core : il relève
// chaque phrase dite sans fichier son (voice.misses de l'application, signalée ici par le crochet `__voixManquee`, posé sur
// chaque contexte et chaque page, et qui survit aux rechargements) et, à la fin du parcours :
//  - une phrase que l'inventaire (tools/voix/inventaire.mjs) ne connaît pas fait ÉCHOUER le parcours : composée à la volée,
//    elle échapperait toujours à la fabrication et serait dite par la synthèse du navigateur, une autre voix ;
//  - une phrase de l'inventaire pas encore fabriquée est seulement signalée (le parent la fabriquera, docs/VOIX.md ;
//    VOIX_A_FABRIQUER=stricte : elle fait échouer aussi) ;
//  - une phrase volontairement absente (un texte d'essai) est permise par `voixPermise(/…/)`.
// Il pose aussi `__demarrageAuto` (l'écran de démarrage s'efface seul, ci-dessous), `__accueilUnToucher` (l'accueil en un toucher)
// et `__finSansBouton` (lot « La boutique du récif » : la récompense finit sans son bouton de fin, la boutique ou le récif ;
// « à demain » vient aussitôt, comme avant la boutique).
import { chromium as pw } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { inventaire } from "../../tools/voix/inventaire.mjs";
import { ARGS_ANDROID, optionsProfil, REFERENCE } from "./appareils.mjs";

// (lot « Banc Android et recette en conditions réelles », point 2) LE BANC PAR DÉFAUT : chaque Chromium est lancé dans les
// conditions d'un Android (tests/e2e/appareils.mjs, ARGS_ANDROID) : la lecture automatique refusée, 8 lecteurs de médias au
// plus, WebGL ; un contexte ouvert sans taille d'écran reçoit le profil de la tablette de référence (s5e : 1 138 × 711,
// densité 2,25, tactile, Chrome Android). Les options d'un parcours passent après : un parcours qui rétablit la lecture
// automatique, ou qui prend la voix rapide, sans service worker ou sans son, le déclare en tête de son fichier
// (« BANC ANDROID, raccourcis : … », tests/unit/banc.test.mjs). Le banc complet (application installée, relances, appareil
// tué, gel, réseau, quota, budgets) : la classe Appareil d'appareils.mjs.

// (lot « Recette de l'enfant et nettoyage des couches », point 1) LA COUVERTURE, pour l'inventaire des couches (docs/COUCHES.md) :
// avec COUVERTURE=dossier, chaque page relève le JavaScript exécuté et les règles CSS utilisées (Chromium, par fonction et
// par bloc), les fichiers demandés au serveur et les images des planches réellement dessinées (sprites.frame) ; un fichier
// JSON par page dans le dossier, à sa fermeture. tools/couverture.mjs les réunit.
const COUV = process.env.COUVERTURE ? resolve(process.env.COUVERTURE) : null;
let nCouv = 0;
const demarrer = async (page) => {
  if (!COUV || page.__couv) return page;
  page.__couv = { fichiers: new Set(), sprites: new Set() };
  const pc = page.close.bind(page); page.close = async (...a) => { await arreter(page); return pc(...a); };
  page.on("request", (r) => page.__couv.fichiers.add(new URL(r.url()).pathname));
  try { await page.exposeBinding("__spriteVu", (_s, n) => page.__couv.sprites.add(n)); } catch { /* déjà posé sur le contexte */ }
  await page.addInitScript(() => {
    const vus = new Set(), poser = () => { const s = window.__app?.sprites; if (!s || s.__couv) return setTimeout(poser, 200); s.__couv = true; const f = s.frame.bind(s); s.frame = (n, i = 0) => { if (!vus.has(n)) { vus.add(n); window.__spriteVu?.(n)?.catch?.(() => {}); } return f(n, i); }; };
    poser();
  });
  await page.coverage.startJSCoverage({ resetOnNavigation: false, reportAnonymousScripts: false });
  await page.coverage.startCSSCoverage({ resetOnNavigation: false });
  return page;
};
const arreter = async (page) => {
  const c = page.__couv; if (!c || c.fini) return; c.fini = true;
  try {
    const js = (await page.coverage.stopJSCoverage()).filter((e) => /\/js\//.test(e.url)).map((e) => ({ url: new URL(e.url).pathname, functions: e.functions }));
    const css = (await page.coverage.stopCSSCoverage()).filter((e) => /\.css/.test(e.url)).map((e) => ({ url: new URL(e.url).pathname, ranges: e.ranges }));
    mkdirSync(COUV, { recursive: true });
    writeFileSync(resolve(COUV, `${process.pid}-${nCouv++}.json`), JSON.stringify({ parcours: process.argv[1], js, css, fichiers: [...c.fichiers], sprites: [...c.sprites] }));
  } catch (e) { console.log(`note couverture : ${e.message.split("\n")[0]}`); }
};
const fermerPages = (ctx) => Promise.all(ctx.pages().map(arreter));

const manquees = new Map(), permises = [];
export const voixPermise = (...re) => { permises.push(...re); };
// les phrases relevées jusqu'ici (pour un parcours qui veut les vérifier lui-même)
export const voixManquees = () => [...manquees.keys()];
const noter = (_source, s) => { if (typeof s === "string") manquees.set(s, (manquees.get(s) ?? 0) + 1); };
// (lot « Correctifs de la tablette » : l'écran de démarrage attend un toucher ; dans les parcours, il s'efface seul quand tout
// est chargé, sans la bienvenue du lancement : `__demarrageAuto`. Un parcours qui l'essaie le remet à false, par un script
// posé après celui-ci : demarrageReel(contexte).)
const brancher = async (cible) => {
  try { await cible.exposeBinding("__voixManquee", noter); } catch { /* déjà posé */ }
  try { await cible.addInitScript(() => { window.__demarrageAuto ??= true; window.__accueilUnToucher ??= true; window.__finSansBouton ??= true; }); } catch { /* déjà posé */ }
  if (COUV && cible.newPage && !cible.__couv) {
    cible.__couv = true;
    const np = cible.newPage.bind(cible), close = cible.close.bind(cible);
    cible.newPage = async (...a) => demarrer(await np(...a));
    cible.close = async (...a) => { await fermerPages(cible); return close(...a); };
    for (const p of cible.pages()) await demarrer(p);
  }
  return cible;
};
export const demarrageReel = (cible) => cible.addInitScript(() => { window.__demarrageAuto = false; });
// (lot « Banc Android », point 2) l'écran de démarrage TOUCHÉ POUR DE VRAI, à chaque chargement de page, dès qu'il est prêt : le
// toucher qui autorise la voix sur Android (la lecture automatique y est refusée). Pour les parcours qui jouent la vraie voix
// sans essayer eux-mêmes l'écran de démarrage : ils restent écrits comme avant (`goto`, puis `__ready`).
const toucheur = (page) => page.on("domcontentloaded", () => {
  page.waitForSelector(".demarrage.pret", { timeout: 600000 }).then(async (h) => {
    const b = await h.boundingBox(); if (!b) return;
    const x = b.x + b.width / 2, y = b.y + b.height * 0.75;
    if (page.context()._options?.hasTouch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
  }).catch(() => {});
});
export const demarrageTouche = async (contexte) => { await demarrageReel(contexte); contexte.on("page", toucheur); for (const p of contexte.pages()) toucheur(p); };
// (lot « Correctifs : passage de l'échauffement aux voiliers », point 10 : l'accueil est en deux touchers ; dans les parcours
// écrits avant, un galet de l'accueil s'ouvre au premier toucher : `__accueilUnToucher`. Les parcours du lot, qui essaient
// l'accueil réel, le remettent à false : accueilReel(contexte).)
export const accueilReel = (cible) => cible.addInitScript(() => { window.__accueilUnToucher = false; });
// (lot « La boutique du récif » : les parcours de la boutique essaient le vrai bouton de fin de la récompense)
export const finReelle = (cible) => cible.addInitScript(() => { window.__finSansBouton = false; });

// (un contexte sans taille d'écran : la tablette de référence)
const profilParDefaut = (o = {}) => (o.viewport === undefined ? { ...optionsProfil(REFERENCE), ...o } : o);
const avecAndroid = (o = {}) => ({ ...o, args: [...ARGS_ANDROID(), ...(o.args ?? [])] });
const envelopper = (browser) => {
  const newContext = browser.newContext.bind(browser), newPage = browser.newPage.bind(browser), close = browser.close.bind(browser);
  browser.newContext = async (o, ...a) => brancher(await newContext(profilParDefaut(o), ...a));
  browser.newPage = async (o, ...a) => { const p = await newPage(profilParDefaut(o), ...a); await brancher(p.context()); return demarrer(p); };
  if (COUV) browser.close = async (...a) => { await Promise.all(browser.contexts().map(fermerPages)); return close(...a); };
  return browser;
};
export const chromium = {
  ...pw,
  launch: async (o, ...a) => envelopper(await pw.launch(avecAndroid(o), ...a)),
  launchPersistentContext: async (dir, o, ...a) => brancher(await pw.launchPersistentContext(dir, profilParDefaut(avecAndroid(o)), ...a)),
  executablePath: () => pw.executablePath(),
};

// le bilan, à la sortie du parcours
process.on("exit", () => {
  const vues = [...manquees.keys()].filter((s) => !permises.some((re) => re.test(s)));
  if (!vues.length) { console.log("ok   voix : aucune phrase dite sans fichier"); return; }
  let inv = new Map(); try { inv = inventaire(); } catch (e) { console.log(`ÉCHEC voix : inventaire illisible (${e.message})`); process.exitCode = 1; return; }
  const horsInventaire = vues.filter((s) => !inv.has(s)), aFabriquer = vues.filter((s) => inv.has(s));
  if (horsInventaire.length) {
    console.log(`ÉCHEC voix : ${horsInventaire.length} phrase(s) dite(s) sans fichier et absente(s) de l'inventaire (tools/voix/inventaire.mjs) :`);
    for (const s of horsInventaire) console.log(`       « ${s} »`);
    process.exitCode = 1;
  }
  if (aFabriquer.length) {
    const strict = process.env.VOIX_A_FABRIQUER === "stricte";
    console.log(`${strict ? "ÉCHEC" : "note "} voix : ${aFabriquer.length} phrase(s) de l'inventaire pas encore fabriquée(s) (docs/VOIX.md) : ${aFabriquer.slice(0, 8).map((s) => `« ${s} »`).join(", ")}${aFabriquer.length > 8 ? "…" : ""}`);
    if (strict) process.exitCode = 1;
  }
});
