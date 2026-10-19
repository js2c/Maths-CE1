// L'ÉCHAUFFEMENT QUITTÉ PENDANT SA PHRASE D'ENTRÉE (lot « Recette de l'enfant et nettoyage des couches », point 3 : défaut
// trouvé par l'enfant imprévisible, graine 1063). La maison pendant « On commence par s'échauffer… », puis un autre exercice
// choisi depuis l'accueil en pause : la séance en pause est terminée, et son échauffement disait ensuite sa seconde phrase
// (« Tape la réponse, puis touche la coche verte. ») sur l'écran suivant. Cause : à l'abandon, les rangements de l'étape
// coupaient la phrase en cours (`voice.stop()`), qui se terminait alors comme dite, avant que la voix soit abandonnée.
//   node tests/e2e/echauffement-quitte.mjs
// BANC ANDROID, raccourcis : sans service worker, son coupé
// (raison : chaque cas part d'une base neuve, dans un navigateur neuf : la voix y est la vraie, mais installer l'application
// (140 Mo, environ une minute) pour chaque cas n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. L'application installée, relancée, gelée, hors ligne, est éprouvée sur le banc Android
// (installation.mjs, journee.mjs).)
import { readFileSync } from "node:fs";
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const textes = JSON.parse(readFileSync("app/content/textes.json", "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + "?nosw&son=non&module=1&sansLecon&guides=0&cran=conseille"); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__dit = []; v.say = (t, o) => { window.__dit.push([performance.now(), t]); return say(t, o); }; });
const tap = async (s, w = 450) => { await page.tap(s, { force: true }); await page.waitForTimeout(w); };
await tap(".play", 100);
// la phrase d'entrée de l'échauffement commence (voix réelle : elle dure plus d'une seconde)
await page.waitForFunction((e) => window.__dit.some(([, t]) => e.includes(t)) && window.__app.voice.speaking, textes.echauffement, { timeout: 60000, polling: 20 });
await page.waitForTimeout(300);
await tap(".session-home", 900);
await tap(".keep.choisir", 900); await tap('.choix-ex[aria-label="calcul"]'); await tap('.choix-ex[aria-label="calcul"]', 900);
const t0 = await page.evaluate(() => performance.now());
await tap('.choix-tuile[data-key="2"]'); await tap('.choix-tuile[data-key="2"]', 300);
await page.waitForTimeout(8000);
const apres = await page.evaluate((t0) => window.__dit.filter(([t]) => t > t0).map(([, x]) => x), t0);
check(await page.evaluate(() => window.__app.session?.rec?.module === 3), "le calcul rapide, choisi depuis la pause, commence");
// (le calcul rapide a son propre échauffement, qui dit à son tour ses deux phrases : seule compte une seconde phrase dite avant
// la première phrase de ce nouvel échauffement)
const i = apres.indexOf(textes.pave);
check(i < 0 || apres.slice(0, i).some((t) => textes.echauffement.includes(t)), `la seconde phrase de l'échauffement quitté n'est plus dite (${apres.join(" | ")})`);
check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
