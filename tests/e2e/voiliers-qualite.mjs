// LA QUALITÉ DES VOILIERS SUR UNE PARTIE ENTIÈRE (lot « Recette de l'enfant et nettoyage des couches », point 0.4 ; docs/LOTS.md,
// fiche 9). Sur la tablette, le bateau devenait flou : une seule image lente (l'entrée dans la scène, l'arrivée d'un bateau)
// faisait passer la qualité de 1 (mer, bateaux et bouées en 1,5×, le réglage du parent du 10 octobre) à 0 pour toute la
// partie, car elle ne remontait que sous 14 ms. Le parcours joue une partie entière (WebGL logiciel, processeur ralenti),
// à la taille de la tablette (1280 × 800, densité 1,5 : 1920 × 1200 pixels), et relève :
//   - chaque changement de qualité (de, à, temps d'image moyen qui l'a causé) ;
//   - la résolution des bateaux et des bouées (canvas de la scène), qui doit rester celle de la qualité 1 (1,5×) ;
//   - le temps d'image (intervalles entre images, hors transitions comprises) ;
//   - le journal de l'espace parent (« Qualité des voiliers »).
//   node tests/e2e/voiliers-qualite.mjs [--lent 4] [--bateaux 12] [--densite 1.5] [--sans-controle]
//   --sans-controle : mesure seulement (pour comparer avec main, où la règle n'existe pas)
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const LENT = Number(arg("--lent", 4)), BATEAUX = Number(arg("--bateaux", 12)), DENSITE = Number(arg("--densite", 1.5)), CONTROLE = !args.includes("--sans-controle");
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: DENSITE, hasTouch: true });
const page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + `?nosw&voix=rapide&son=non&sans=echauffement&choix=4:1&cran=conseille&questions=${BATEAUX}`); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
const cdp = await context.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: LENT });
// les intervalles entre images, relevés par la page tout du long
await page.evaluate(() => { const g = (window.__gaps = []); let l = 0; const f = (t) => { if (l) g.push(t - l); l = t; requestAnimationFrame(f); }; requestAnimationFrame(f); });
await page.locator(".play").first().tap({ force: true });
await page.waitForFunction(() => window.__app.voiliers?.actif, null, { timeout: 60000 });
const t0 = Date.now(); let joues = 0, tailles = new Set();
while (joues < BATEAUX) {
  const fini = await page.waitForFunction(() => window.__app.voiliers?.attend || !window.__app.voiliers?.actif, null, { timeout: 120000, polling: 100 }).then(() => page.evaluate(() => !window.__app.voiliers?.actif));
  if (fini) break;
  tailles.add(await page.evaluate(() => { const c = document.querySelector("canvas.voiliers-bateaux"); return c ? `${c.width}×${c.height}` : "?"; }));
  await page.evaluate(() => window.__app.voiliers.api.deposer(window.__app.voiliers.q.k));
  joues++;
  await page.waitForFunction(() => !window.__app.voiliers?.attend, null, { timeout: 30000 }).catch(() => {});
}
const s = await page.evaluate(() => ({ q: window.__voiliersQualite ?? [], gaps: window.__gaps.slice(60), journal: null, k: window.__app.stage.k }));
s.journal = await page.evaluate(() => window.__app.store.setting("voiliersQualite"));
const g = [...s.gaps].sort((a, b) => a - b), moy = g.reduce((a, b) => a + b, 0) / g.length, p = (x) => g[Math.floor(x * (g.length - 1))];
console.log(`     partie : ${joues} bateaux en ${Math.round((Date.now() - t0) / 1000)} s, processeur ralenti ${LENT}×, densité ${DENSITE}`);
console.log(`     temps d'image : moyenne ${moy.toFixed(1)} ms, médiane ${p(0.5).toFixed(1)}, 95e centile ${p(0.95).toFixed(1)}, ${g.filter((x) => x > 33).length} images > 33 ms sur ${g.length}`);
console.log(`     changements de qualité : ${s.q.length ? s.q.map((c) => `${c.de} → ${c.a} à ${(c.t / 1000).toFixed(1)} s${c.ms ? ` (${c.ms} ms)` : ""}`).join(", ") : "aucun"}`);
console.log(`     canvas des bateaux et des bouées : ${[...tailles].join(", ")}`);
if (CONTROLE) {
  const attendu = `${Math.round(1280 * Math.min(2, 1.5 * s.k))}×${Math.round(800 * Math.min(2, 1.5 * s.k))}`;
  check(tailles.size === 1 && tailles.has(attendu), `bateaux et bouées toujours en 1,5× (${attendu}), quelle que soit la mer`);
  check((s.journal ?? []).length === s.q.length, `chaque changement de qualité est noté pour l'espace parent (${(s.journal ?? []).length})`);
  check(s.q.every((c) => c.a <= 1), "la qualité ne monte jamais au-dessus de celle du parent");
}
check(!errors.length, `aucune erreur dans la page${errors.length ? ` (${errors[0]})` : ""}`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
