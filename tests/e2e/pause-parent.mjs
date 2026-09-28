// SORTIE DE LA PAUSE PAR LE PARENT (décision du parent du 27 septembre 2026) dans Chromium (1280 × 800,
// tactile), voix accélérée : l'enfant n'a pas de bouton d'arrêt ; pendant une pause, l'espace parent montre
// « Terminer la séance » (avec confirmation) ; la séance est enregistrée comme interrompue (terminée : non,
// sans récompense), la scène est rangée (bernard-l'ermite compris) et l'application revient à l'accueil, où une
// nouvelle séance peut commencer. Hors pause, le bouton n'existe pas. Captures dans tests/e2e/out/pause-parent.
//   node tests/e2e/pause-parent.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/pause-parent"));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const ready = async () => page.waitForFunction(() => window.__ready !== undefined);
const waitQ = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 90000 });
const typeIn = async (n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
const answer = async () => { const v = await page.evaluate(() => { const f = window.__app.facts.q; return f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b; }); await typeIn(v); };
const openParent = async () => {
  const b = await page.locator(".logo").last().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(2300); await page.mouse.up();
  await page.waitForSelector(".pa-gate"); for (const d of "1234") await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForSelector(".pa-sheet");
};

await page.goto(url + "?nosw&voix=rapide"); await ready();
await page.evaluate(async () => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); await s.setSetting("codeParent", "1234"); });
// hors pause : pas de bouton « Terminer la séance »
await openParent();
check(!(await page.locator(".pa-pause").count()), "hors pause, l'espace parent ne propose pas de terminer une séance");
await page.tap(".pa-close"); await page.waitForTimeout(300);
// une séance d'additions (le bernard-l'ermite est là), une réponse, puis la maison
await page.goto(url + "?nosw&voix=rapide&cran=conseille&sans=echauffement&module=2&sansLecon&guides=0&questions=6"); await ready();
await page.tap(".play", { force: true });
await waitQ(); await answer(); await waitQ();
const stars0 = await page.evaluate(() => window.__app.session.rec.etoiles);
await page.tap(".session-home", { force: true }); await page.waitForTimeout(600);
await openParent(); await page.waitForTimeout(300);
await shot("1-espace-parent-pause");
check(await page.locator(".pa-pause button").count() === 1, "pendant la pause : « Terminer la séance… » en haut de l'espace parent");
await page.tap(".pa-pause button"); await page.waitForTimeout(200);
await shot("2-confirmation");
check(await page.locator(".pa-pause .pa-confirm").count() === 1, "une confirmation est demandée");
// « Annuler » : rien ne change
await page.tap(".pa-pause .pa-confirm .pa-btn:not(.danger)"); await page.waitForTimeout(150);
check(!(await page.locator(".pa-pause .pa-confirm").count()), "« Annuler » referme la confirmation");
await page.tap(".pa-pause button"); await page.tap(".pa-pause .pa-confirm .danger");
await page.waitForSelector(".play:not(.keep)", { timeout: 10000 }); await page.waitForTimeout(800);
await shot("3-accueil");
const st = await page.evaluate(async () => {
  const s = (await window.__app.store.all("seances")).at(-1), vis = (sel) => [...document.querySelectorAll(sel)].some((e) => getComputedStyle(e).visibility !== "hidden" && e.isConnected);
  return { terminee: s.terminee, parParent: s.arreteeParParent, etapes: s.etapes.map((e) => e.id), etoiles: s.etoiles, paused: document.getElementById("stage").classList.contains("paused"), hermit: !!window.__app.hermit, maison: vis(".session-home"), skip: vis(".skip"), keys: vis(".key"), keep: document.querySelectorAll(".keep.play").length, lune: !!document.querySelector(".moon"), recompense: !!document.querySelector(".shelltap") };
});
check(st.terminee === false && st.parParent && !st.etapes.includes("recompense") && !st.recompense, `la séance est enregistrée comme interrompue, sans récompense (${JSON.stringify(st)})`);
check(st.etoiles === stars0, `les étoiles déjà gagnées restent (${st.etoiles})`);
check(!st.paused && !st.hermit && !st.maison && !st.skip && !st.keys && !st.keep && !st.lune, "l'accueil est propre : ni pause, ni bernard-l'ermite, ni pavé, ni « passer », ni lune (la séance du jour n'est pas faite)");
// une nouvelle séance commence normalement ; l'interrompue ne bouge plus
await page.goto(url + "?nosw&voix=rapide&cran=conseille&sans=echauffement&module=2&sansLecon&guides=0&questions=3"); await ready();
await page.tap(".play", { force: true }); await waitQ();
const again = await page.evaluate(async () => (await window.__app.store.all("seances")).map((s) => ({ t: s.terminee, p: !!s.arreteeParParent })));
check(again.length === 2 && again[0].p && !again[0].t, `une nouvelle séance commence ; l'interrompue reste notée (${JSON.stringify(again)})`);
// l'historique du parent la montre « interrompue »
check(errors.length === 0, `aucune erreur dans la page${errors.length ? ` : ${errors.join(" | ")}` : ""}`);
await browser.close(); srv.close();
