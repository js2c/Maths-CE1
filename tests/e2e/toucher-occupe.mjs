// UN TOUCHER BREF PENDANT QUE LA PAGE EST OCCUPÉE (lot « Recette de l'enfant et nettoyage des couches », premier passage de
// l'agent qui joue l'enfant, constats 1 à 4 : dans l'étal, le récif, l'album, la boutique, les touchers ne faisaient rien).
// Cause : l'appui long était décidé par une minuterie de 0,5 s (engine/ui.js, onBrief) ; quand la page est occupée (une scène
// lourde, une tablette lente), le contact et le lever du doigt sont traités en retard, la minuterie passe avant le lever, et
// un toucher bref devient un appui long, qui ne lance rien. Désormais, l'appui est jugé sur la durée réelle, du contact au
// lever (horodatage des événements). Le parcours touche la maison en pleine question, 120 ms, le lever n'arrivant à la page
// que 0,7 s après le contact (ce que relevait le pilote) : la séance doit passer en pause. Puis un vrai appui long (0,8 s) :
// rien ne doit être lancé.
//   node tests/e2e/toucher-occupe.mjs
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
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
const page = await context.newPage(), cdp = await context.newCDPSession(page);
await page.goto(url + "?nosw&voix=rapide&son=non&sans=echauffement&choix=1:3&cran=conseille&sansLecon"); await page.waitForFunction(() => window.__ready !== undefined);
await page.locator(".play").first().tap({ force: true });
await page.waitForFunction(() => window.__app.screen?.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
const [x, y] = await page.evaluate(() => { const q = document.querySelector(".session-home").getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; });
// le contact, puis le lever du doigt daté `ms` après lui, mais qui n'arrive à la page que `retard` ms plus tard (une tablette
// chargée : le lever est traité après la minuterie de 0,5 s)
const toucher = async (ms, retard) => {
  const t = Date.now() / 1000;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }], timestamp: t });
  await new Promise((r) => setTimeout(r, Math.max(ms, retard)));
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t + ms / 1000 });
  await page.waitForTimeout(1200);
};
await toucher(120, 700);
check(await page.evaluate(() => !!window.__app.enPause), "un toucher bref de la maison (120 ms), son lever arrivé 0,7 s après le contact : la séance passe en pause");
// la reprise, puis un vrai appui long sur la maison : il ne lance rien
if (await page.evaluate(() => !!window.__app.enPause)) { await page.locator(".play.keep").first().tap({ force: true }); await page.waitForTimeout(800); }
check(await page.evaluate(() => !window.__app.enPause), "reprise");
await toucher(800, 800);
check(await page.evaluate(() => !window.__app.enPause), "un appui long de 0,8 s sur la maison ne lance rien");
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
