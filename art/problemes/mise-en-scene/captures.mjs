// CAPTURES DE LA MAQUETTE « MISE EN SCÈNE DES PROBLÈMES » (art/problemes/mise-en-scene/index.html) dans
// docs/maquettes/problemes-scene/ : chaque écran en 1280 × 800 ; quelques-uns sur le petit smartphone (640 × 360, densité 2,
// le profil `petit-smartphone` du banc) ; et l'écran d'aujourd'hui, pris dans l'application (« avant »), pour comparer.
// Contrôle aussi, sur chaque écran, que la bulle ne couvre rien de ce qu'on touche (étiquettes, plaque, objets du partage).
//   node art/problemes/mise-en-scene/captures.mjs [--sans-avant]
import { chromium } from "../../node_modules/playwright-core/index.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../../..", import.meta.url))), OUT = join(ROOT, "docs/maquettes/problemes-scene");
mkdirSync(OUT, { recursive: true });
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".ogg": "audio/ogg", ".webm": "video/webm", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const srv = createServer(async (req, rsp) => {
  let p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
  try { if ((await stat(p)).isDirectory()) p = join(p, "index.html"); rsp.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" }); rsp.end(await readFile(p)); }
  catch { rsp.writeHead(404); rsp.end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [], defauts = [];
const recouvre = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

async function maquette(W, H, dpr, liste, prefixe) {
  const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr })).newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/art/problemes/mise-en-scene/?capture`); await page.waitForFunction(() => window.__ready, null, { timeout: 30000 });
  const tous = await page.evaluate(() => window.__ecrans);
  for (const [i, e] of (liste ?? tous).entries()) {
    await page.evaluate((id) => window.__go(id), e); await page.waitForTimeout(150);
    // la bulle, en px de la scène, contre ce qu'on touche
    const r = await page.evaluate(() => { const d = document.getElementById("dit"); if (!d.textContent) return null; return { x: d.offsetLeft, y: d.offsetTop, w: d.offsetWidth, h: d.offsetHeight, zones: window.__zones }; });
    if (r) for (const z of r.zones) if (recouvre(r, z)) defauts.push(`${e} : la bulle couvre ${z.quoi}`);
    const n = `${prefixe}${String(i + 1).padStart(2, "0")}-${e}.png`;
    await page.screenshot({ path: join(OUT, n) }); console.log(`  ${n}`);
  }
  await page.close();
}
await maquette(1280, 800, 1, null, "");
await maquette(640, 360, 2, ["groupes-question", "partage-manipule", "transformation-correction"], "petit-");

// l'écran d'aujourd'hui (l'application, sans la modifier) : les gourmandises, en 1280 × 800 et sur le petit smartphone
// (par le navigateur des parcours, tests/e2e/navigateur.mjs : il passe l'écran de démarrage, qui attend un toucher, et relève les
// phrases dites ; l'application servie comme GitHub Pages, tests/serve.mjs)
await browser.close(); srv.close();
if (!process.argv.includes("--sans-avant")) {
  const { chromium: banc } = await import("../../../tests/e2e/navigateur.mjs"), { serve } = await import("../../../tests/serve.mjs");
  const { srv: s2, url } = await serve(0), b2 = await banc.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
  for (const [W, H, dpr, n] of [[1280, 800, 1, "avant-gourmandises.png"], [640, 360, 2, "avant-petit-gourmandises.png"]]) {
    const ctx = await b2.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true }), page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${url}?nosw&voix=rapide&son=non&choix=7:7&cran=conseille&sans=echauffement&sansLecon&questions=2&enonce=grp-07`);
    await page.waitForFunction(() => window.__ready !== undefined); await page.tap(".play", { force: true });
    await page.waitForFunction(() => { const f = window.__app.facts; return f?.q?.module === 7 && f.resolve && !f.locked; }, null, { timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: join(OUT, n) }); console.log(`  ${n}`); await ctx.close();
  }
  await b2.close(); s2.close();
}
// les captures allégées (une palette de 256 couleurs : les aplats du style A n'y perdent rien ; 14 Mo → 4 Mo), si Python et PIL sont là
try { execFileSync("python3", ["-c", "import glob,sys\nfrom PIL import Image\nfor f in glob.glob(sys.argv[1]+'/*.png'):\n  Image.open(f).convert('RGB').quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(f,optimize=True)", OUT]); } catch { console.log("(captures non allégées : python3 et PIL absents)"); }
for (const d of defauts) console.log(`DÉFAUT ${d}`);
if (errors.length) console.error(errors.join("\n"));
process.exit(errors.length || defauts.length ? 1 : 0);
