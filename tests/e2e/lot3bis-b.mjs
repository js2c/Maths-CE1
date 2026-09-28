// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md, B1 à B11) : parcours et captures de l'intégration.
//   node tests/e2e/lot3bis-b.mjs [--out dossier] [--seul choisir,legende,appui,calcul,additions,fins,placer,lecons,parent,cosmetique]
// Parties :
//   choisir   — B1 : les trois écrans de niveaux aux trois formats (numéros, lueur, rien de coupé ni sur la pieuvre)
//   legende   — B2 : la légende ouverte puis fermée par la croix et par un toucher dehors, sans rien lancer
//   appui     — B3 : appui long de 0,8 s sur chaque pictogramme : étiquette, rien de lancé ; toucher bref : lancé
// (les autres parties s'ajoutent au fil de l'étape 4)
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/lot3bis-b")); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--seul", null)?.split(","), want = (p) => !ONLY || ONLY.includes(p);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
export const open = async (q = "", { prep = null, size = [1280, 800], scale = 2 } = {}) => {
  const context = await browser.newContext({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: scale, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
};
const tap = async (page, sel) => { await page.tap(sel, { force: true }); await page.waitForTimeout(250); };
const shot = (page, name) => page.screenshot({ path: join(OUT, `${name}.png`) });
// les boîtes (px logiques) des éléments d'un sélecteur
const boxes = (page, sel) => page.evaluate((sel) => { const ui = document.querySelector("#ui"), k = ui.getBoundingClientRect().width / 1280, o = ui.getBoundingClientRect(); return [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { key: e.dataset.key, x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k }; }); }, sel);

// B1 : les écrans de niveaux
if (want("choisir")) {
  for (const size of [[1280, 800], [1920, 1200], [1340, 800]]) {
    // des niveaux validés (l'étoile doit rester dans sa plaque) : calcul 1 à 3 acquis, conseillé 4
    const prep = async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [1, 2, 3], obtenus: [], vus: {}, fenetres: {}, lecons: [] }); };
    const { page, context, errors } = await open("&cran=conseille&sans=echauffement", { size, scale: size[0] > 1500 ? 1 : 2, prep });
    await page.waitForSelector(".choisir"); await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
    for (const ex of ["ligne", "additions", "calcul", "lecons"]) {
      await tap(page, `.choix-ex[aria-label="${ex}"]`); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(500);
      const b = await boxes(page, ".choix-tuile");
      const inside = b.every((r) => r.x >= 4 && r.y >= 4 && r.x + r.w <= 1276 && r.y + r.h <= 796);
      // la pieuvre (à gauche) et les algues de droite : aucune plaque avant x = 410 ni après x = 1165
      const clear = b.every((r) => r.x >= 410 && r.x + r.w <= 1165);
      const overlap = b.some((r, i) => b.some((s, j) => j > i && r.x < s.x + s.w && s.x < r.x + r.w && r.y < s.y + s.h && s.y < r.y + r.h));
      check(inside && clear && !overlap, `${size.join("×")} ${ex} : ${b.length} plaques dans l'écran, hors de la pieuvre et des algues, sans chevauchement`);
      await shot(page, `B1-${ex}-${size.join("x")}`);
      if (size[0] === 1280) { const c = b.find((r) => r.key === String(ex === "calcul" ? 3 : 1)) ?? b[0]; await page.screenshot({ path: join(OUT, `B1-${ex}-zoom.png`), clip: { x: c.x - 30, y: c.y - 30, width: 2 * c.w + 60, height: 2 * c.h + 60 } }); }
      await tap(page, ".choix-retour"); await page.waitForSelector(".choix-ex");
    }
    check(!errors.length, `${size.join("×")} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// un appui tenu `ms` millisecondes (vrai toucher : Input.dispatchTouchEvent), au centre d'un élément
const hold = async (page, sel, ms) => {
  const b = await page.locator(sel).first().boundingBox(), x = b.x + b.width / 2, y = b.y + b.height / 2, cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await page.waitForTimeout(ms);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
};
const inScreen = async (page, sel) => (await boxes(page, sel)).every((r) => r.x >= 0 && r.y >= 0 && r.x + r.w <= 1280 && r.y + r.h <= 800);

// B2 : la légende
if (want("legende")) {
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
  await page.waitForSelector(".choisir"); await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
  for (const ex of ["ligne", "additions", "calcul", "lecons"]) {
    await tap(page, `.choix-ex[aria-label="${ex}"]`); await page.waitForSelector(".legende");
    const lb = (await boxes(page, ".legende"))[0], tiles = await boxes(page, ".choix-tuile");
    check(!tiles.some((r) => lb.x < r.x + r.w && r.x < lb.x + lb.w && lb.y < r.y + r.h && r.y < lb.y + lb.h), `${ex} : le bouton de la légende est hors de la zone des plaques`);
    const spoken = await page.evaluate(() => (window.__app.voice.log ?? []).length);
    await tap(page, ".legende"); await page.waitForSelector(".legende-panneau"); await page.waitForTimeout(300);
    const n = await page.locator(".legende-ligne").count();
    check(n === tiles.length, `${ex} : le panneau a une ligne par niveau (${n} / ${tiles.length})`);
    await shot(page, `B2-legende-${ex}`);
    if (ex === "ligne") { await page.evaluate(() => { document.querySelector(".legende-defile").scrollTop = 10000; }); await page.waitForTimeout(200); await shot(page, "B2-legende-ligne-bas"); }
    // fermer : la croix (ligne, calcul), un toucher dehors (additions, leçons)
    if (ex === "ligne" || ex === "calcul") await tap(page, ".legende-fermer");
    else { const cdp = await context.newCDPSession(page), vp = page.viewportSize(); await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: vp.width * 0.05, y: vp.height * 0.95 }] }); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(300); }
    const st = await page.evaluate(() => ({ panneau: !!document.querySelector(".legende-panneau"), tuiles: document.querySelectorAll(".choix-tuile").length, runner: !!window.__app.session }));
    check(!st.panneau && st.tuiles === tiles.length && !st.runner, `${ex} : fermée (${ex === "ligne" || ex === "calcul" ? "la croix" : "toucher dehors"}), rien de lancé, les plaques toujours là`);
    await tap(page, ".choix-retour"); await page.waitForSelector(".choix-ex");
  }
  check(!errors.length, `légende : aucune erreur (${errors.join(" | ")})`); await context.close();
}

// B3 : l'appui long sur les pictogrammes
if (want("appui")) {
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
  await page.waitForSelector(".choisir"); await page.waitForTimeout(300);
  for (const [sel, key] of [[".play", "jouer"], [".choisir", "choisir"], [".reefkey", "recif"], [".albumkey", "album"]]) {
    await hold(page, sel, 800); await page.waitForTimeout(100);
    const st = await page.evaluate(() => ({ lab: !!document.querySelector(".etiquette"), home: !!document.querySelector(".choisir"), choix: !!document.querySelector(".choix-ex"), session: !!window.__app.session }));
    check(st.lab && st.home && !st.choix && !st.session && (await inScreen(page, ".etiquette")), `accueil, appui long de 0,8 s sur « ${key} » : étiquette visible (dans l'écran), rien de lancé`);
    await shot(page, `B3-appui-${key}`);
    await page.waitForTimeout(2300);
    check(!(await page.locator(".etiquette").count()), `« ${key} » : l'étiquette disparaît 2 s après`);
  }
  await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
  check(true, "accueil, toucher bref sur « choisir » : l'écran des exercices s'ouvre");
  for (const ex of ["ligne", "additions", "calcul", "lecons"]) {
    await hold(page, `.choix-ex[aria-label="${ex}"]`, 800); await page.waitForTimeout(100);
    const st = await page.evaluate(() => ({ lab: !!document.querySelector(".etiquette"), tiles: document.querySelectorAll(".choix-tuile").length }));
    check(st.lab && !st.tiles && (await inScreen(page, ".etiquette")), `« choisir », appui long de 0,8 s sur « ${ex} » : étiquette, rien de lancé`);
    await shot(page, `B3-appui-${ex}`);
  }
  await tap(page, '.choix-ex[aria-label="calcul"]'); await page.waitForSelector(".choix-tuile");
  check(true, "toucher bref sur « calcul » : ses niveaux s'ouvrent");
  check(!errors.length, `appui long : aucune erreur (${errors.join(" | ")})`); await context.close();
}

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} ÉCHEC(S)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
