// CAPTURES DE LA MAQUETTE DU LOT « PROBLÈMES » : chaque écran de art/problemes/index.html en 1280 × 800, dans
// docs/maquettes/problemes/. Sert la racine du dépôt (la maquette prend les planches de app/, les images de l'étal de art/etal/).
//   node art/problemes/captures.mjs
import { chromium } from "../node_modules/playwright-core/index.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url))), OUT = join(ROOT, "docs/maquettes/problemes");
mkdirSync(OUT, { recursive: true });
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const srv = createServer(async (req, rsp) => {
  let p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
  try { if ((await stat(p)).isDirectory()) p = join(p, "index.html"); rsp.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" }); rsp.end(await readFile(p)); }
  catch { rsp.writeHead(404); rsp.end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const ECRANS = ["enonce", "question", "pave", "erreur-barres", "correction", "groupes", "partage", "comparaison", "deux-etapes"];
for (const [i, e] of ECRANS.entries()) {
  await page.goto(`http://127.0.0.1:${srv.address().port}/art/problemes/?capture&ecran=${encodeURIComponent(e)}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 30000 }); await page.waitForTimeout(300);
  const name = `${String(i + 1).padStart(2, "0")}-${e.replace(/[?=+]/g, (c) => ({ "?": "x", "=": "-", "+": "+" })[c])}`;
  await page.screenshot({ path: join(OUT, `${name}.png`) }); console.log(`  ${name}.png`);
}
await browser.close(); srv.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
