// LE NAVIGATEUR DES PARCOURS (lot « Correctifs de la tablette », point 5 : « +10 » dit par l'ancienne voix). Tous les parcours
// (tests/e2e/*.mjs, tests/recette-fonctionnelle/) lancent Chromium par ce module au lieu de playwright-core : il relève
// chaque phrase dite sans fichier son (voice.misses de l'application, signalée ici par le crochet `__voixManquee`, posé sur
// chaque contexte et chaque page, et qui survit aux rechargements) et, à la fin du parcours :
//  - une phrase que l'inventaire (tools/voix/inventaire.mjs) ne connaît pas fait ÉCHOUER le parcours : composée à la volée,
//    elle échapperait toujours à la fabrication et serait dite par la synthèse du navigateur, une autre voix ;
//  - une phrase de l'inventaire pas encore fabriquée est seulement signalée (le parent la fabriquera, docs/VOIX.md ;
//    VOIX_A_FABRIQUER=stricte : elle fait échouer aussi) ;
//  - une phrase volontairement absente (un texte d'essai) est permise par `voixPermise(/…/)`.
import { chromium as pw } from "../../art/node_modules/playwright-core/index.mjs";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const manquees = new Map(), permises = [];
export const voixPermise = (...re) => { permises.push(...re); };
// les phrases relevées jusqu'ici (pour un parcours qui veut les vérifier lui-même)
export const voixManquees = () => [...manquees.keys()];
const noter = (_source, s) => { if (typeof s === "string") manquees.set(s, (manquees.get(s) ?? 0) + 1); };
const brancher = async (cible) => { try { await cible.exposeBinding("__voixManquee", noter); } catch { /* déjà posé */ } return cible; };

const envelopper = (browser) => {
  const newContext = browser.newContext.bind(browser), newPage = browser.newPage.bind(browser);
  browser.newContext = async (...a) => brancher(await newContext(...a));
  browser.newPage = async (...a) => { const p = await newPage(...a); await brancher(p.context()); return p; };
  return browser;
};
export const chromium = {
  ...pw,
  launch: async (...a) => envelopper(await pw.launch(...a)),
  launchPersistentContext: async (...a) => brancher(await pw.launchPersistentContext(...a)),
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
