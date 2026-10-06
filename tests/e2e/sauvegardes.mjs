// LOT 3, ÉTAPE 2 : les sauvegardes de test (tools/sauvegarde-test.mjs) se restaurent dans l'application sans erreur :
// un mois, trois mois, un profil en difficulté. Pour chacune : la restauration par l'espace parent (Store.restore, comme
// le bouton « Oui, restaurer »), puis l'accueil (« jouer » : la dernière séance était la veille), l'album, l'espace parent
// (onglets Calendrier, Séances, Progression) et l'écran « choisir » (niveaux validés, conseillé). Captures regardées.
//   node tests/e2e/sauvegardes.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/sauvegardes"); mkdirSync(OUT, { recursive: true });
const CASES = [["mois", "reel", 2, 4], ["trois-mois", "reel", 3, 12], ["difficulte", "diff", 2, 6]];
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
for (const [name, profil, per, weeks] of CASES) {
  const file = join(OUT, `${name}.json`);
  execFileSync("node", ["tools/sauvegarde-test.mjs", profil, String(per), String(weeks), "--sortie", file]);
  const dump = JSON.parse(readFileSync(file, "utf8"));
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  const problem = await page.evaluate(async (d) => { const D = await import("./js/parent/data.js"), S = await import("./js/engine/store.js"); return D.restoreProblem(d, { base: S.DB_NAME, version: S.MIGRATIONS.length, stores: S.STORES }); }, dump).catch((e) => String(e));
  await page.evaluate(async (d) => { await window.__app.store.setSetting("codeParent", "1234"); await window.__app.store.restore(d, ["codeParent"]); }, dump);
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(600);
  const st = await page.evaluate(async () => { const s = window.__app.store, seances = await s.all("seances"), last = seances.filter((x) => x.terminee).at(-1); return { n: seances.length, last: last && new Date(last.debut).toDateString(), play: !!document.querySelector(".play"), code: await s.setting("codeParent"), mascotte: await s.setting("mascotte"), niveau: (await s.get("niveaux", 1))?.niveau }; });
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  check(!problem, `${name} : fichier accepté par la restauration (${problem ?? "aucun problème"})`);
  check(st.n > 0 && st.last === yesterday && st.play && st.code === "1234", `${name} : ${st.n} séances, la dernière hier (${st.last}), « jouer » proposé, code parent gardé, niveau de la ligne ${st.niveau}`);
  await page.screenshot({ path: join(OUT, `${name}-1-accueil.png`) });
  await page.tap(".albumkey", { force: true }); await page.waitForTimeout(2500); await page.screenshot({ path: join(OUT, `${name}-2-album.png`) });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".choisir", { force: true }); await page.tap('.choix-ex[aria-label="ligne"]', { force: true }); await page.waitForTimeout(300);
  await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(500);
  const tiles = await page.evaluate(() => ({ conseille: document.querySelector('.choix-tuile[data-conseille="1"]')?.dataset.key, valides: document.querySelectorAll('.choix-tuile[data-valide="1"]').length }));
  check(Number(tiles.conseille) === st.niveau && tiles.valides === st.niveau - 1, `${name} : écran « choisir » cohérent (conseillé ${tiles.conseille}, ${tiles.valides} niveaux validés)`);
  await page.screenshot({ path: join(OUT, `${name}-3-choisir.png`) });
  // l'espace parent (code 1234)
  page.evaluate(() => window.__app.parent.open()).catch(() => {});
  await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(800);
  for (const tab of ["Calendrier", "Séances", "Progression"]) { await page.click(`.pa-tabs button:has-text("${tab}")`).catch(() => {}); await page.waitForTimeout(700); await page.screenshot({ path: join(OUT, `${name}-4-parent-${tab}.png`), fullPage: false }); }
  check(!errors.length, `${name} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
