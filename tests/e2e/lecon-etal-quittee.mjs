// UNE LEÇON DE L'ÉTAL QUITTÉE PENDANT QUE SA SCÈNE S'INSTALLE (lot « Recette de l'enfant et nettoyage des couches », point 3 :
// défaut trouvé par l'enfant imprévisible, graine 1, réduit à deux actions : les leçons, puis L18). La leçon installe sa
// propre scène de l'étal (lessons/etal.js) ; quittée par la maison avant la fin de l'installation, la scène restait à l'écran
// sur l'accueil, et la leçon reprenait ensuite. Les images de l'étal sont ici retardées (1,5 s) pour ouvrir la fenêtre ; la
// maison est touchée à plusieurs moments : rien de l'étal ne doit rester, aucune phrase de la leçon ne doit être dite après.
// Les autres leçons, dont les planches se chargent aussi à l'ouverture (L2 la corde aux bouées géantes, L4 le bernard-l'ermite,
// L10 les centaines, L13 les rangées), passent par la même épreuve : rien de la leçon ne reste sur l'accueil.
//   node tests/e2e/lecon-etal-quittee.mjs
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
for (const [id, apres] of [["L18", 100], ["L18", 600], ["L18", 1200], ["L18", 4000], ...["L2", "L4", "L10", "L13"].flatMap((l) => [[l, 100], [l, 1200]])]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let retard = false;
  await context.route(/assets\/(etal|art)\//, async (r) => { if (retard) await new Promise((ok) => setTimeout(ok, 1500)); await r.continue(); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); window.__saidT.push(performance.now()); return say(t, o); }; window.__saidT = []; addEventListener("pointerdown", (e) => { if (e.target.closest?.(".homekey")) window.__maisonT = performance.now(); }, true); });
  await page.tap(".leconskey", { force: true }); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`); await page.waitForTimeout(500);
  retard = true;
  for (let i = 0; i < 2; i++) { await page.tap(`.lecons-tuile[data-key="${id}"]`, { force: true }); await page.waitForTimeout(120); }
  await page.waitForTimeout(apres);
  await page.tap(".homekey", { force: true });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => ({ reste: [...document.querySelectorAll("#ui > *, #front > *")].filter((e) => e.getBoundingClientRect().width > 2 && e.checkVisibility({ visibilityProperty: true, opacityProperty: true }) && !e.matches(".galet, .logo, .stars, .mascotte-tap, .bulle, .moon, .speaker, .lune, .homekey, .session-home") && !e.closest(".galet")).map((e) => e.className || e.tagName), aides: !!window.__app.aidBoard?.used, scene: [...document.querySelectorAll("canvas.etal-decor, .etal-scene")].filter((e) => e.isConnected && e.getBoundingClientRect().width > 2 && getComputedStyle(e).display !== "none").length, lecon: !!window.__app.etalLecon, galets: !!document.querySelector(".galet"), dit: window.__said.filter((_, i) => window.__saidT[i] > window.__maisonT) }));
  check(r.galets && !r.scene && !r.lecon && !r.aides, `${id}, maison ${apres} ms après le choix : l'accueil, sans la scène de l'étal ni le calque des aides (étal : ${r.scene}, scène de la leçon : ${r.lecon}, aides : ${r.aides})`);
  console.log(`     ${id} ${apres} : à l'écran, en plus de l'accueil : ${r.reste.join(", ") || "rien"}`);
  const lecon = r.dit.filter((t) => !/Touche|Choisis|bulle|encore|demain/i.test(t));
  check(!lecon.length, `${id}, maison ${apres} ms après : la leçon ne parle plus (${lecon.join(" | ")})`);
  check(!errors.length, `${id} ${apres} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
