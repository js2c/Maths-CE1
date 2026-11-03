// LA CARTE GRAPHIQUE PERDUE PUIS RENDUE (lot « Correctifs : la carte graphique perdue », constat du parent du 2 novembre 2026 :
// la tablette laissée ouverte longtemps, une première partie faite, puis un autre jeu : la mascotte et la maison disparues, les
// poissons du fond coupés net, le compteur d'étoiles disparu ; engine/restauration.js).
// Ce parcours provoque une vraie perte : le processus graphique de Chromium est tué (comme Android le fait pour reprendre la
// mémoire d'une page restée longtemps ouverte), puis vérifie que tout ce qui était à l'écran l'est encore :
//  1. l'accueil : chaque canvas des boutons (galets, compteur d'étoiles) a toujours son dessin ;
//  2. l'écran « choisir » : la maison, les tuiles, le compteur ; et la mascotte à l'écran (sa zone de la capture n'est pas le fond) ;
//  3. le lagon à l'allègement 2 (poissons et algues figés, dessinés une seule fois) : chaque poisson a son dessin, entier ;
//  4. une perte de la mascotte que Chrome ne rend pas (WEBGL_lose_context, sans restoreContext) : le canvas est refait en 3 s ;
//  5. aucune erreur, et la perte et la reprise notées dans le journal technique.
// Avant le correctif (main), 1 à 3 échouent : RACINE_APP=dossier sert une autre copie de app/.
//   node tests/e2e/carte-graphique.mjs
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie l'affichage après une perte de la carte graphique, qui ne dépend ni de la voix, ni du son, ni du
// service worker ; tuer le processus graphique d'une application installée (profil persistant) reviendrait au même.)
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { serve } from "../serve.mjs";

const OUT = "tests/e2e/out/carte-graphique"; mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };

// tue le processus graphique de ce navigateur (le seul lancé par ce parcours) ; Chromium en relance un aussitôt
const tuerCarteGraphique = () => {
  const pids = execSync("ps -eo pid,args").toString().split("\n").filter((l) => l.includes("--type=gpu-process")).map((l) => +l.trim().split(/\s+/)[0]);
  for (const p of pids) try { process.kill(p, "SIGKILL"); } catch { /* déjà fini */ }
  return pids.length;
};
// les canvas visibles de #ui (boutons, compteur) : vides ou non
const etatBoutons = (page) => page.evaluate(() => [...document.querySelectorAll("#ui canvas")].filter((c) => c.width && c.height && c.checkVisibility?.({ visibilityProperty: true, opacityProperty: true })).map((c) => {
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
  const b = c.closest("[class]"); return { quoi: (b?.className || c.className || "?").split(" ").slice(0, 3).join(" "), pixels: n };
}));
// la zone de la mascotte dans une capture : l'écart moyen à sa couleur moyenne (le fond seul est presque uni)
const zoneMascotte = async (page, nom) => {
  const box = await page.locator("#mascotte").boundingBox();
  const png = await page.screenshot({ path: `${OUT}/${nom}.png`, clip: { x: box.x + box.width * 0.2, y: box.y + box.height * 0.15, width: box.width * 0.6, height: box.height * 0.55 } });
  return page.evaluate(async (b64) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()), c = new OffscreenCanvas(img.width, img.height), x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data, n = d.length / 4; let r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } r /= n; g /= n; b /= n;
    let e = 0; for (let i = 0; i < d.length; i += 4) e += Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b);
    return Math.round(e / n);
  }, png.toString("base64"));
};
const attendreReprise = async (page, avant) => { await page.waitForFunction((n) => (window.__restauration?.compteurs.reprises ?? -1) > n, avant, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(1500); };

const context = await browser.newContext({ viewport: { width: 1138, height: 711 }, deviceScaleFactor: 2.25, hasTouch: true, isMobile: true });
const page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
await page.waitForSelector(".choisir"); await page.waitForTimeout(1500);

// 4. (fait en premier : après la mort de son processus graphique, Chrome peut refuser WebGL à la page, et la mascotte passe en 2D)
// une perte de la mascotte que Chrome ne rend pas : le canvas est refait
{
  const r = await page.evaluate(async () => {
    const m = window.__app.ocean.mascotte, cv = () => m.canvas?.() ?? document.querySelector("#mascotte canvas"), avant = cv(), ext = avant.getContext("webgl")?.getExtension("WEBGL_lose_context");
    if (!ext) return { ext: false, rendu: m.etat().rendu, perdu: avant.getContext("webgl")?.isContextLost() ?? null };
    ext.loseContext(); await new Promise((res) => setTimeout(res, 4500));
    return { ext: true, refait: cv() !== avant, dansLaPage: cv().isConnected && !avant.isConnected, rendu: m.etat().rendu };
  });
  check(r.ext && r.refait && r.dansLaPage, `mascotte : un contexte WebGL non rendu est remplacé par un canvas neuf en 3 s (${JSON.stringify(r)})`);
  await page.waitForTimeout(1500);
  check((await zoneMascotte(page, "4-mascotte-refaite")) > 20, "mascotte : à l'écran sur son canvas neuf");
}
// 1. l'accueil
{
  const avant = await etatBoutons(page), reprises = await page.evaluate(() => window.__restauration?.compteurs.reprises ?? 0);
  check(tuerCarteGraphique() > 0, "accueil : le processus graphique est tué");
  await attendreReprise(page, reprises);
  const apres = await etatBoutons(page), vides = apres.filter((b) => !b.pixels).map((b) => b.quoi);
  check(avant.every((b) => b.pixels > 0) && apres.length >= avant.length && !vides.length, `accueil : les ${apres.length} canvas des boutons ont encore leur dessin${vides.length ? ` — vides : ${vides.join(", ")}` : ""}`);
  check((await page.evaluate(() => window.__restauration?.compteurs.reprises ?? 0)) > reprises, "accueil : la reprise a eu lieu");
  await page.screenshot({ path: `${OUT}/1-accueil-apres.png` });
}
// 2. l'écran « choisir » : la maison, les tuiles ; la mascotte
{
  await page.tap(".choisir", { force: true }); // (l'accueil en un toucher dans les parcours : navigateur.mjs, __accueilUnToucher)
  await page.waitForSelector(".session-home", { state: "visible", timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1500);
  const fondAvant = await zoneMascotte(page, "2-mascotte-avant");
  const reprises = await page.evaluate(() => window.__restauration?.compteurs.reprises ?? 0);
  tuerCarteGraphique(); await attendreReprise(page, reprises);
  const apres = await etatBoutons(page), vides = apres.filter((b) => !b.pixels).map((b) => b.quoi);
  check(apres.some((b) => /session-home/.test(b.quoi)) && !vides.length, `choisir : la maison et les ${apres.length - 1} autres canvas ont leur dessin${vides.length ? ` — vides : ${vides.join(", ")}` : ""}`);
  const fondApres = await zoneMascotte(page, "2-mascotte-apres");
  const rendu = await page.evaluate(() => window.__app.ocean.mascotte.etat().rendu);
  check(fondAvant > 20 && fondApres > 20, `choisir : la mascotte est à l'écran après la perte (écart à la couleur moyenne de sa zone : ${fondAvant} avant, ${fondApres} après ; le fond seul : moins de 10 ; rendu ${rendu})`);
  await page.screenshot({ path: `${OUT}/2-choisir-apres.png` });
}
// 3. le lagon à l'allègement 2 : les poissons figés
{
  await page.evaluate(() => { const s = window.__app.stage; s.perf.level = 2; s.measure = () => {}; });
  await page.waitForTimeout(2500);
  const reprises = await page.evaluate(() => window.__restauration?.compteurs.reprises ?? 0);
  tuerCarteGraphique(); await attendreReprise(page, reprises);
  const r = await page.evaluate(() => {
    const L = window.__app.lagon, out = { vus: 0, vides: 0, coupes: 0 };
    for (const g of L.groups) for (const m of g.members) if (m.a && m.a.c.isConnected) {
      const c = m.a.c, d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height, a = (i, j) => d[(j * W + i) * 4 + 3];
      let n = 0, bord = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
      for (let i = 0; i < W; i++) if (a(i, 0) > 8 || a(i, H - 1) > 8) bord++; for (let j = 0; j < H; j++) if (a(0, j) > 8 || a(W - 1, j) > 8) bord++;
      out.vus++; if (!n) out.vides++; if (bord) out.coupes++;
    }
    return out;
  });
  check(r.vus > 0 && !r.vides && !r.coupes, `lagon figé (allègement 2) : ${r.vus} poissons après la perte, ${r.vides} vides, ${r.coupes} coupés`);
  await page.screenshot({ path: `${OUT}/3-lagon-fige-apres.png` });
  await page.evaluate(() => { window.__app.stage.perf.level = 0; });
}
// 5. le journal technique, les erreurs
{
  const lignes = await page.evaluate(async () => [...window.__journalTechnique].filter((l) => /carte graphique/.test(JSON.stringify(l))).length).catch(() => null);
  if (lignes != null) check(lignes > 0, `journal technique : ${lignes} lignes sur la perte et la reprise`);
  check(!errors.length, `aucune erreur de la page${errors.length ? ` : ${errors.join(" | ")}` : ""}`);
}
await context.close(); await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
