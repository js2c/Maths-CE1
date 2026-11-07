// L'ÉCHAUFFEMENT PASSÉ PENDANT UNE CORRECTION, LA PAGE OCCUPÉE (lot « Nouveaux boutons, mascotte du récif et étoiles » : échec
// intermittent de tests/e2e/lot3ter.mjs pendant sa recette, « la correction ne reprend pas après le saut », cause trouvée ;
// docs/JOURNAL-CONCEPTION.md). Une réponse fausse à l'échauffement : la correction secoue l'ardoise (une attente de l'horloge),
// puis dit « a plus b, ça fait n. ». Si la page est occupée au moment où la secousse se termine, sa minuterie n'a pas encore
// tourné quand l'enfant touche « passer l'échauffement » : l'attente est mise en pause, déjà finie en temps actif. La coche
// rendait alors l'horloge à la séance AVANT d'arrêter la correction : l'attente finie se terminait aussitôt et la correction
// enchaînait sa phrase par-dessus la suite. Ce parcours force ce moment (le fil occupé 0,8 s, puis le toucher dans la même
// tâche) plusieurs fois ; il échouait avant le correctif (main.js, warmupSkipKey, `confirm`).
//   node tests/e2e/passer-echauffement-correction.mjs [--fois 3]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : il vérifie un ordre d'événements dans la page, forcé à la main ; la vraie voix et l'application installée n'y changent
// rien et sont éprouvées par journee.mjs, enfant.mjs --android, installation.mjs.)
import { chromium } from "./navigateur.mjs";
import { readFileSync } from "node:fs";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), FOIS = Number(args.includes("--fois") ? args[args.indexOf("--fois") + 1] : 3);
const T = JSON.parse(readFileSync("app/content/textes.json", "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const correction = new RegExp(T.faitCorrection.replace(/[.?]/g, "\\$&").replace(/\{[abn]\}/g, "\\d+"));

for (let i = 1; i <= FOIS; i++) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non&sans=probleme&cran=conseille&module=1&sansLecon&faits=10"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => { const f = window.__app.facts; return f?.resolve && !f.locked && f.q; }, null, { timeout: 30000 });
  // une réponse fausse, tapée au pavé (le fait + 1)
  const faux = await page.evaluate(() => { const q = window.__app.facts.q, f = q.forme; return String((f === "trouDroite" ? q.b : f === "trouGauche" ? q.a : q.a + q.b) + 1); });
  for (const d of faux) await page.tap(`.key[data-key="${d}"]`, { force: true });
  await page.tap('.key[data-key="valider"]', { force: true });
  await page.waitForSelector(".skip:not(.skip-warmup)", { timeout: 5000 });
  // LE MOMENT FORCÉ : le fil occupé pendant toute la secousse (0,8 s), puis « passer l'échauffement » touché dans la même tâche : la
  // minuterie de la secousse n'a pas pu tourner
  const avant = await page.evaluate(() => { const t = performance.now(); while (performance.now() - t < 800) { /* la page occupée */ } window.__app.warmupSkip.tap(); return window.__said.length; });
  await page.waitForTimeout(400);
  check(await page.evaluate(() => !!window.__app.warmupPending), `essai ${i} : en attente de la coche`);
  const mark = await page.evaluate(() => window.__said.length);
  await page.tap(".check-warmup", { force: true });
  await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 15000 });
  await page.waitForTimeout(2000);
  const apres = await page.evaluate((m) => window.__said.slice(m), mark);
  check(!apres.some((t) => correction.test(t) || /Ce n'est pas grave/.test(t)), `essai ${i} : la correction ne reprend pas après le saut (${apres.slice(0, 3).join(" / ")})`);
  check(avant >= 0 && !errors.length, `essai ${i} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} ÉCHEC(S)`); process.exitCode = 1; }
