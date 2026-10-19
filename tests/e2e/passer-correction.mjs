// « PASSER LA CORRECTION » APRÈS LA LIGNE CORRIGÉE (lot « Recette de l'enfant et nettoyage des couches », point 3 : défaut
// trouvé par l'enfant imprévisible, graine 1062 : une erreur de la page). La correction de la ligne graduée montre la ligne
// corrigée, puis dit la bonne réponse ; « passer » touché à ce moment-là remontrait la même image de la ligne, déjà donnée au
// calque : « The input ImageBitmap has been detached ». Le parcours touche « passer » juste après que la ligne corrigée est
// montrée, plusieurs fois.
//   node tests/e2e/passer-correction.mjs
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie la logique et l'affichage de nombreuses situations, chacune sur une base neuve dans un
// navigateur neuf : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application (140
// Mo, environ une minute) pour chaque situation n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur le banc Android (journee.mjs,
// enfant.mjs --android, installation.mjs, veille.mjs).)
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&choix=1:3&format=lire&sans=echauffement&sansLecon&guides=0&questions=6"); await page.waitForFunction(() => window.__ready !== undefined);
// la ligne corrigée montrée : on le note, pour toucher « passer » aussitôt après
await page.evaluate(() => { const l = window.__app.line, show = l.show.bind(l); window.__corrigee = 0; l.show = (b) => { const r = show(b); if (b && window.__app.screen?.fix === b) window.__corrigee++; return r; }; });
await page.locator(".play").first().tap({ force: true });
let essais = 0;
for (let k = 0; k < 3; k++) {
  const prete = await page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked && document.querySelectorAll(".answer").length; }, null, { timeout: 60000 }).then(() => true).catch(() => false);
  if (!prete) { check(false, `la question suivante arrive après la correction passée (essai ${k + 1})`); break; }
  const n0 = await page.evaluate(() => window.__corrigee);
  // une réponse fausse : une bulle qui n'est pas la bonne
  await page.evaluate(() => { const s = window.__app.screen, b = [...document.querySelectorAll(".answer")].find((x) => Number(x.dataset.value) !== s.q.answer); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); });
  const vue = await page.waitForFunction((n0) => window.__corrigee > n0, n0, { timeout: 30000 }).then(() => true).catch(() => false);
  if (!vue) continue;
  essais++;
  await page.evaluate(() => [...document.querySelectorAll(".skip")].at(-1)?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })));
  await page.locator(".skip").last().tap({ force: true }).catch(() => {});
  await page.waitForTimeout(1500);
}
check(essais > 0, `la correction passée juste après la ligne corrigée (${essais} fois)`);
check(!errors.length, `aucune erreur de la page (${errors.join(" | ")})`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
