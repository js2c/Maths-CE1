// CAPTURES DE LA MAQUETTE DU LOT « LES LEÇONS » : les écrans clés en 1280 × 800, dans docs/maquettes/lecons/.
// Sert la racine du dépôt (la maquette prend les planches, la bulle et les aides de app/, la mascotte de art/mascotte/).
//   node art/lecons/captures.mjs [--scale 1]
import { chromium } from "../node_modules/playwright-core/index.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url))), OUT = join(ROOT, "docs/maquettes/lecons");
const args = process.argv.slice(2), SCALE = Number(args.includes("--scale") ? args[args.indexOf("--scale") + 1] : 1);
mkdirSync(OUT, { recursive: true });
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".webm": "video/webm", ".mp4": "video/mp4", ".woff2": "font/woff2", ".ogg": "audio/ogg" };
const srv = createServer(async (req, rsp) => {
  let p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
  try { if ((await stat(p)).isDirectory()) p = join(p, "index.html"); rsp.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" }); rsp.end(await readFile(p)); }
  catch { rsp.writeHead(404); rsp.end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${srv.address().port}/art/lecons/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: SCALE, hasTouch: true });
const page = await ctx.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const open = async (q) => { await page.goto(BASE + "?capture&ecran=" + q); await page.waitForFunction(() => window.__pret, null, { timeout: 60000 }); };
// la bulle écrite jusqu'au bout (la phrase « dite »)
const parlee = async (texte) => { await page.waitForFunction((t) => (!t || window.__dit === t) && document.querySelector(".bulle:not(.cachee)") && !document.querySelector(".bulle-texte .m:not(.on)"), texte, { timeout: 20000 }); await page.waitForTimeout(250); };
const shot = async (name) => { await page.screenshot({ path: join(OUT, `${name}.png`) }); console.log(`  ${name}.png`); };
const tapCase = async (a, b) => { const r = await page.locator("#grille").boundingBox(); await page.touchscreen.tap(r.x + 16 + 52 + b * 64 + 32, r.y + 16 + 52 + a * 64 + 32); };

await open("accueil"); await parlee("Touche une bulle : jouer, choisir, les leçons, le récif ou l'album."); await shot("01-accueil");
await open("lecons"); await parlee("Quelle leçon veux-tu regarder ? Touche-la."); await shot("02-menu-lecons");
await page.tap('[data-lecon="L5"]'); await parlee("Les amis de dix."); await shot("03-menu-lecon-touchee");
await open("lecons&multiplication=future"); await parlee(); await shot("04-menu-avec-table-multiplication-plus-tard");
await open("fin&lecon=L1"); await parlee("À toi ! Touche la grande bulle pour t'entraîner."); await shot("05-fin-L1");
await open("fin&lecon=L5&passee=1"); await parlee(); await shot("06-fin-L5-passee");
await open("fin&lecon=L8"); await parlee(); await shot("07-fin-L8");
await open("table"); await parlee("Touche une case : je te dis le calcul."); await shot("10-table");
for (const [a, b, n] of [[7, 5, "11-table-7+5-deux-cadres"], [7, 3, "12-table-7+3-cadre"], [3, 3, "13-table-3+3-reflet"], [3, 4, "14-table-3+4-double-plus-un"], [6, 2, "15-table-6+2-sauts"], [5, 3, "16-table-5+3-maison"], [8, 0, "17-table-8+0"]]) {
  await tapCase(a, b); await parlee(`${a} plus ${b}, ${a + b}.`); await shot(n);
}
await open("l10&moment=cent&avant=1"); await parlee(); await shot("20-L10-cent-avant");
await open("l10&moment=cent"); await parlee(); await shot("21-L10-cent-apres");
await open("l10&moment=trois&avant=1"); await parlee(); await shot("22-L10-trois-chaluts-avant");
await open("l10&moment=trois"); await parlee(); await shot("23-L10-trois-chaluts-apres");
console.log(errors.length ? `erreurs dans la page :\n${errors.join("\n")}` : "aucune erreur dans la page");
await browser.close(); srv.close();
