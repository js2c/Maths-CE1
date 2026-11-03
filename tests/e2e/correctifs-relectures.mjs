// LE LOT « CORRECTIFS DES RELECTURES » (docs/IDEES.md, section 3 : les points des relectures qui avaient une valeur par défaut).
//   R8 : dans les leçons de la monnaie, la bulle de la mascotte ne couvre plus l'argent que la phrase sort du portefeuille (il est
//        déclaré à la bulle avant que la voix commence : lessons/etal.js, `boitesSortie` de la scène). Chaque leçon qui sort
//        l'argent (L15, L16, L18), depuis le menu des leçons et depuis l'accueil en pause : la bulle relevée toutes les 100 ms,
//        jamais sur une pièce ou un billet sorti ou posé, et toujours là quand la voix parle (relecture du lot, R14 : à l'étal, la
//        bulle essaie le ciel en dernier recours) ; captures pendant la phrase qui sort l'argent.
//   R9 : le triangle du galet « jouer » et du galet « continuer » (l'accueil en pause) a des pointes arrondies : plus d'encoche
//        claire (sea/decor.ts, drawPlayIcon) ; captures agrandies des deux galets.
// Sur le profil de la tablette de référence (s5e), sur le petit smartphone, et à 1280 × 800 et 1920 × 1200.
//   node tests/e2e/correctifs-relectures.mjs [--profils s5e,petit-smartphone,1280,1920]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours relève la place de la bulle pendant des leçons entières, plusieurs fois, sur une base neuve à chaque
// fois : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps sans rien vérifier de plus (la bulle se place au
// début de chaque phrase, quelle que soit sa durée) ; installer l'application et le son n'y changent rien. La vraie voix et
// l'application installée sont éprouvées par la journée d'usage et l'enfant imprévisible sur le banc.)
import { chromium } from "./navigateur.mjs";
import { optionsProfil, PROFILS } from "./appareils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = "tests/e2e/out/correctifs-relectures"; mkdirSync(OUT, { recursive: true });
const TAILLES = arg("--profils", "s5e,petit-smartphone,1280,1920").split(",");
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const ETAT = { module: 6, niveau: 2, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L15", "L16", "L17", "L18"], exemples: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };

const ouvrir = async (T, q = "", prep = null) => {
  const profil = PROFILS[T] ? T : null, w = T === "1920" ? [1920, 1200] : [1280, 800];
  const context = await browser.newContext(profil ? optionsProfil(profil) : { viewport: { width: w[0], height: w[1] }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (e) => { await window.__app.store.setSetting("echauffement", false); await window.__app.store.put("niveaux", e); }, ETAT);
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise&meteo=beau" + q); await page.waitForFunction(() => window.__ready !== undefined);
  if (profil && PROFILS[profil].ralenti > 1) { const cdp = await context.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: PROFILS[profil].ralenti }); }
  return { page, context, errors };
};
const deuxTouchers = async (page, sel) => { for (let i = 0; i < 2; i++) { await page.tap(sel, { force: true }); await page.waitForTimeout(250); } };

for (const T of TAILLES) {
  // ---------------------------------------------------------------- R8
  for (const mode of ["menu", "pause"]) for (const id of ["L15", "L16", "L18"]) {
    const { page, context, errors } = await ouvrir(T, mode === "pause" ? "&choix=6:2&cran=conseille" : "");
    if (mode === "pause") {
      await page.tap(".play", { force: true });
      await page.waitForFunction(() => window.__app.etal?.attend, null, { timeout: 120000, polling: 100 });
      await page.tap(".homekey", { force: true }); await page.waitForFunction(() => window.__app.enPause, null, { timeout: 15000 }); await page.waitForTimeout(600);
    }
    await page.tap(".leconskey", { force: true }); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`, { timeout: 30000 }); await page.waitForTimeout(400);
    await deuxTouchers(page, `.lecons-tuile[data-key="${id}"]`);
    await page.waitForFunction(() => !!document.querySelector(".lessonkey"), null, { timeout: 30000 });
    // la bulle relevée toutes les 100 ms pendant toute la leçon ; une capture quand l'argent vient de sortir (première phrase)
    const suivi = page.evaluate(async () => {
      const app = window.__app, out = { vues: 0, couvre: 0, ex: [], declare: 0 };
      const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
      while (document.querySelector(".lessonkey")) {
        await new Promise((r) => setTimeout(r, 100));
        const s = app.etalLecon ?? app.etal, e = app.bulle?.etat?.();
        if (app.bulle?.zones?.has("argent-lecon")) out.declare++;
        // (relecture du lot, R14 : la bulle là tant que la voix parle ; avant, à l'étal, elle renonçait faute de place)
        if (app.voice?.speaking) { out.parle = (out.parle ?? 0) + 1; if (!app.bulle?.etat?.()?.visible) out.sans = (out.sans ?? 0) + 1; }
        if (!s?.api || !e?.visible || !e.rect) continue;
        out.vues++;
        const a = s.api.boites().reduce((x, b) => x + inter(e.rect, b), 0);
        if (a > 30) { out.couvre++; if (out.ex.length < 4) out.ex.push(`« ${e.texte.slice(0, 40)}… » (${e.place}, ${Math.round(a)} px²)`); }
      }
      return out;
    });
    // (relecture du lot, R3 : la capture attend que l'argent sorti ait fini de bouger, sinon le portefeuille apparaissait encore)
    await page.waitForFunction(() => (window.__app.etalLecon ?? window.__app.etal)?.api?.etat().pf === "sorti", null, { timeout: 30000, polling: 50 }).catch(() => {});
    await page.waitForFunction(() => { const a = (window.__app.etalLecon ?? window.__app.etal)?.api, b = JSON.stringify(a?.boites() ?? []), ok = b !== "[]" && b === window.__bAvant; window.__bAvant = b; return ok; }, null, { timeout: 15000, polling: 250 }).catch(() => {});
    await page.screenshot({ path: `${OUT}/r8-${T}-${mode}-${id}.png` });
    const r = await suivi;
    check(r.declare > 0, `${T}, ${mode}, ${id} : l'argent qui sort est déclaré à la bulle pendant sa phrase (${r.declare} relevés)`);
    check(r.couvre === 0, `${T}, ${mode}, ${id} : la bulle ne couvre jamais l'argent (${r.vues} relevés avec la bulle${r.ex.length ? ` ; ${r.ex.join(" ; ")}` : ""})`);
    check((r.sans ?? 0) <= 2, `${T}, ${mode}, ${id} : la bulle est là tant que la voix parle (${r.sans ?? 0} relevés sans bulle sur ${r.parle ?? 0})`);
    check(!errors.length, `${T}, ${mode}, ${id} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
  // ---------------------------------------------------------------- R9
  {
    const { page, context, errors } = await ouvrir(T, "&choix=1:1&cran=conseille");
    await page.waitForSelector('.galet[data-key="jouer"]'); await page.waitForTimeout(600);
    const zoom = async (sel, nom) => { const b = await page.locator(sel).boundingBox(); await page.screenshot({ path: `${OUT}/r9-${T}-${nom}.png`, clip: { x: b.x + b.width * 0.25, y: b.y + b.height * 0.2, width: b.width * 0.5, height: b.height * 0.6 }, scale: "device" }); return b; };
    check(!!(await zoom('.galet[data-key="jouer"]', "jouer")), `${T} : le galet « jouer » (capture agrandie du triangle)`);
    await page.screenshot({ path: `${OUT}/r9-${T}-accueil.png` });
    // l'accueil en pause : le galet « continuer », le même triangle
    // (dans les parcours, un toucher ouvre le galet : tests/e2e/navigateur.mjs, __accueilUnToucher)
    await page.tap('.galet[data-key="jouer"]', { force: true });
    await page.waitForFunction(() => window.__app.session?.progress?.etape === "notion" && !!document.querySelector(".homekey") && document.querySelector(".homekey").style.visibility === "visible", null, { timeout: 120000, polling: 100 });
    await page.tap(".homekey", { force: true }); await page.waitForFunction(() => window.__app.enPause, null, { timeout: 15000 }); await page.waitForTimeout(800);
    const sel = (await page.locator('.galet[data-key="continuer"]').count()) ? '.galet[data-key="continuer"]' : '.galet[data-key="jouer"]';
    check(!!(await zoom(sel, "continuer")), `${T} : le galet « continuer » de l'accueil en pause (capture agrandie du triangle)`);
    check(!errors.length, `${T}, galets : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
}
await browser.close(); srv.close();
writeFileSync(`${OUT}/bilan.txt`, fail.length ? fail.join("\n") : "tout est bon\n");
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ncorrectifs des relectures : la bulle ne couvre plus l'argent des leçons ; les triangles des galets capturés");
process.exitCode = fail.length ? 1 : 0;
