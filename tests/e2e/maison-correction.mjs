// LA MAISON PENDANT UNE CORRECTION, EN ENTRAÎNEMENT LIBRE (lot « Recette de l'enfant et nettoyage des couches », second
// passage de l'agent qui joue l'enfant, constat 3) : en multiplication, la maison touchée pendant la correction d'une réponse
// fausse laissait les rangées de poissons sur l'accueil (puis sur la grille des niveaux et le menu des leçons), et la voix
// continuait la correction, puis la question suivante. Pour chaque exercice au pavé (multiplication, calcul rapide) et
// plusieurs moments de la correction : une réponse fausse, la maison, puis rien ne doit rester ni parler.
//   node tests/e2e/maison-correction.mjs
// BANC ANDROID, raccourcis : sans service worker, son coupé
// (raison : chaque cas part d'une base neuve, dans un navigateur neuf : la voix y est la vraie, mais installer l'application
// (140 Mo, environ une minute) pour chaque cas n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. L'application installée, relancée, gelée, hors ligne, est éprouvée sur le banc Android
// (installation.mjs, journee.mjs).)
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
for (const [ex, niveau] of [["multiplication", 2], ["calcul", 4]]) for (const apres of [400, 1500, 3000, 5000]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { const n = Date.now(), s = window.__app.store; await s.setSetting("echauffement", false); await s.add("seances", { debut: n - 600000, fin: n, terminee: true, module: 1, etapes: [] }); });
  await page.goto(url + "?nosw&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.waitForSelector(".again"); await page.tap(".again", { force: true });
  // (second passage de l'agent, constat 5) les images des exercices sont là pendant la phrase d'entrée, pas après
  const tEncore = Date.now(); await page.waitForSelector(".choix-ex", { timeout: 30000 });
  if (ex === "multiplication" && apres === 400) check(Date.now() - tEncore < 2500 && (await page.evaluate(() => window.__app.voice.speaking)), `« Encore ! » : les exercices s'affichent pendant la phrase d'entrée (${Date.now() - tEncore} ms)`);
  await page.waitForTimeout(400);
  for (let i = 0; i < 2; i++) { await page.tap(`.choix-ex[data-key="${ex}"]`, { force: true }); await page.waitForTimeout(400); }
  await page.waitForSelector(".choix-tuile", { timeout: 15000 }); await page.waitForTimeout(400);
  for (let i = 0; i < 2; i++) { await page.tap(`.choix-tuile[data-key="${niveau}"]`, { force: true }); await page.waitForTimeout(400); }
  await page.waitForSelector(".cran", { timeout: 15000 }); await page.tap(".cran", { force: true }).catch(() => {}); await page.waitForTimeout(300);
  if (await page.locator(".cran-ok").count()) await page.tap(".cran-ok", { force: true }).catch(() => {});
  // deux questions au pavé (l'exemple guidé passe tout seul) : la première juste, la seconde fausse (le parcours de l'agent)
  const pret = () => page.waitForFunction(() => { const f = window.__app.facts; return f && f.resolve && !f.locked && !f.detruit; }, null, { timeout: 90000, polling: 100 });
  const taper = async (juste) => {
    await pret(); await page.waitForTimeout(300);
    const n = await page.evaluate(async (ex) => { const q = window.__app.facts.q, m = await import(new URL(ex === "multiplication" ? "js/modules/mult/mult.js" : "js/modules/calc/calc.js", location.href)); return ex === "multiplication" ? m.multAnswer(q) : m.answerOf(q); }, ex);
    const v = String(juste ? n : n + 1);
    for (const d of v) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(150); }
    await page.tap('.key[data-key="valider"]', { force: true });
  };
  await taper(true); await page.waitForTimeout(500); await taper(false);
  await page.waitForTimeout(apres);
  // (ce qui est dit est compté à partir de l'appui sur la maison, relevé dans la page : relevé avant d'envoyer le toucher, il
  // comptait une phrase dite pendant les 40 à 100 ms du trajet du toucher, le « 10 » du comptage de la correction, à 5000 ms ;
  // échec intermittent du parcours, sur main aussi, mesuré le 1er novembre 2026)
  await page.evaluate(() => { window.__avantMaison = undefined; document.querySelector(".session-home").addEventListener("pointerdown", () => { window.__avantMaison = window.__said.length; }, { capture: true, once: true }); });
  await page.tap(".session-home", { force: true });
  const avant = await page.evaluate(() => window.__avantMaison ?? window.__said.length);
  await page.waitForTimeout(7000);
  const r = await page.evaluate((avant) => ({ dit: window.__said.slice(avant), aides: !!window.__app.aidBoard?.used, slate: [...document.querySelectorAll(".slate, .skip, .key")].filter((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden").length, accueil: !!document.querySelector(".galet") }), avant);
  const accueil = await page.evaluate(() => Object.values(window.__app.text.data.accueilDescription ?? {}).concat(window.__app.text.data.accueil ?? [], window.__app.text.data.encore ?? []));
  const etrangers = r.dit.filter((t) => !accueil.flat().includes(t) && !/demain|encore|bulle|Touche/i.test(t));
  check(r.accueil && !r.aides && !r.slate, `${ex}, maison ${apres} ms après la réponse fausse : l'accueil, sans rangées ni ardoise ni pavé (aides : ${r.aides}, éléments : ${r.slate})`);
  check(!etrangers.length, `${ex}, maison ${apres} ms après : plus rien de la correction n'est dit (${etrangers.join(" | ")})`);
  check(!errors.length, `${ex} ${apres} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
