// UNE AIDE D'EMBLÉE INTERROMPUE PAR LA SORTIE (lot « Recette de l'enfant et nettoyage des couches », point 3 : défaut trouvé
// par l'enfant imprévisible, graine 1009 : « 7 plus 6 ? » dit sur l'accueil). Au cran « plus facile », l'appui de la question
// est montré d'emblée, puis la consigne est dite. Quand l'écran des additions est détruit pendant cet appui (ici : la pause,
// puis un autre exercice choisi depuis l'accueil en pause, qui termine la séance), la destruction interrompt l'appui, et sa
// suite redisait la consigne de l'ancienne question, sur l'accueil puis par-dessus le nouvel exercice.
//   node tests/e2e/aide-quittee.mjs
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
await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
await page.goto(url + "?nosw&voix=rapide&son=non&cran=facile&sans=echauffement&module=2&sansLecon&guides=0"); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__dit = []; v.say = (t, o) => { window.__dit.push([performance.now(), t]); return say(t, o); }; });
const tap = async (s, w = 450) => { await page.tap(s, { force: true }); await page.waitForTimeout(w); };
await tap(".play", 300);
await page.waitForFunction(() => window.__app.facts?.q?.aideDEmblee && window.__app.facts.locked && document.querySelector(".skip"), null, { timeout: 90000, polling: 50 });
const q = await page.evaluate(() => ({ a: window.__app.facts.q.a, b: window.__app.facts.q.b })), consigne = `${q.a} plus ${q.b}`;
await tap(".session-home", 900);
await tap(".keep.choisir", 900); await tap('.choix-ex[aria-label="multiplication"]'); await tap('.choix-ex[aria-label="multiplication"]', 900);
const t0 = await page.evaluate(() => performance.now());
await tap('.choix-tuile[data-key="2"]'); await tap('.choix-tuile[data-key="2"]', 300);
await page.waitForTimeout(8000);
const apres = await page.evaluate((t0) => window.__dit.filter(([t]) => t > t0).map(([, x]) => x), t0);
check(await page.evaluate(() => window.__app.session?.rec?.module === 5), "l'exercice choisi depuis la pause (la multiplication) commence");
check(!apres.some((t) => t.includes(consigne)), `la consigne de la question quittée (« ${consigne} ») n'est plus dite (${apres.join(" | ")})`);
check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
