// LE PORTEFEUILLE QUI SE REFERME (lot « Recette de l'enfant et nettoyage des couches », point 3 : défaut trouvé par l'enfant
// imprévisible, graine 1001 : une partie bloquée à l'étal). Poser une pièce par le programme (`api.deposer` : la correction de
// l'étal, les leçons, les parcours) pendant que le portefeuille se refermait attendait pour toujours : `api.ouvrir` ne rouvrait
// pas un portefeuille qui finissait de se fermer. La correction (le pêcheur paie à la place de l'enfant) pouvait rester figée.
//   node tests/e2e/etal-portefeuille.mjs
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
await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); await window.__app.store.put("niveaux", { module: 6, niveau: 2, obtenus: [1], redescentes: [], fenetre: [], vus: 3, taux: [], lecons: ["L15", "L16"], exemples: [1, 2] }); });
await page.goto(url + "?nosw&voix=rapide&son=non&choix=6:2&cran=conseille&meteo=beau&sansLecon"); await page.waitForFunction(() => window.__ready !== undefined);
await page.tap(".play", { force: true });
await page.waitForFunction(() => window.__app.etal?.attend, null, { timeout: 60000, polling: 50 }); await page.waitForTimeout(500);
for (const ecart of [0, 150, 400]) {
  const r = await page.evaluate(async (ecart) => {
    const a = window.__app.etal.api, v = window.__app.etal.q.portefeuille[0];
    await a.ouvrir(); a.fermer(); // le portefeuille se referme…
    await new Promise((ok) => setTimeout(ok, ecart));
    const t0 = performance.now(), it = await Promise.race([a.deposer(v), new Promise((ok) => setTimeout(() => ok("bloqué"), 5000))]);
    const res = { pose: it !== "bloqué" && !!it, ms: Math.round(performance.now() - t0), pf: a.etat().pf };
    await a.rendre(); await a.fermer();
    return res;
  }, ecart);
  check(r.pose && r.ms < 3000, `une pièce posée ${ecart} ms après le début de la fermeture du portefeuille : posée en ${r.ms} ms (portefeuille : ${r.pf})`);
}
check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
