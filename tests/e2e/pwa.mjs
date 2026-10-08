// PWA : installable (avis de Chromium) et utilisable hors ligne (réseau coupé après la première visite) ;
// une seule résolution des planches d'images en cache (lot 1 bis) : celle de l'écran (ici densité 2 : @2x).
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// un vrai profil (pas la navigation privée des contextes ordinaires, où rien n'est installable)
const profile = mkdtempSync(join(tmpdir(), "pwa-"));
const ctx = await chromium.launchPersistentContext(profile, { executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true });
const browser = { close: async () => { await ctx.close(); rmSync(profile, { recursive: true, force: true }); } };
const page = ctx.pages()[0] ?? await ctx.newPage(), cdp = await ctx.newCDPSession(page);
const errors = []; page.on("pageerror", (e) => errors.push(e.message));
let ok = true; const check = (c, m) => { console.log(`${c ? "ok  " : "ÉCHEC"} ${m}`); if (!c) ok = false; };

await page.goto(url);
await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
const manifest = await cdp.send("Page.getAppManifest");
check(!manifest.errors?.length, `manifeste lu sans erreur (${manifest.url.split("/").pop()})`);
const inst = await cdp.send("Page.getInstallabilityErrors");
// attendre que le service worker ait tout mis en cache et contrôle la page
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller !== null && window.__ready !== undefined, null, { timeout: 60000 });
const urls = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys.find((k) => k.startsWith("ocean-"))); return (await c.keys()).map((r) => new URL(r.url).pathname); });
const files = (await (await fetch(url + "sw-files.json")).json()).files, all = new Set(files);
// attendus : tout, sauf les planches @1x qui existent aussi en @2x
const expected = files.filter((f) => { const m = /^(assets\/art\/.+)@1x(-\d+)?\.webp$/.exec(f); return !m || !files.some((g) => g.startsWith(`${m[1]}@2x`)); }); // (une planche peut avoir plusieurs pages)
const has = new Set(urls.map((p) => p.replace(/^\/Maths-CE1\//, "")));
check(expected.every((f) => f === "./" || has.has(f)), `fichiers en cache : ${urls.length} / ${expected.length} attendus (${files.length - expected.length} planches @1x laissées de côté)`);
const art = urls.filter((p) => p.includes("/assets/art/") && p.endsWith(".webp"));
check(art.length > 0 && art.every((p) => /@2x(-\d+)?\.webp$/.test(p) || p.includes("rayons@1x")), `une seule résolution d'images en cache (${art.length} planches : ${art.map((p) => p.split("/").pop()).join(", ")})`);
const errs = inst.installabilityErrors.map((e) => e.errorId);
check(errs.length === 0, `installable selon Chromium${errs.length ? " — " + errs.join(", ") : ""}`);
// réseau coupé : l'application redémarre depuis le cache
await ctx.setOffline(true);
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
await page.tap(".play", { force: true });
await page.waitForSelector(".key", { timeout: 30000 }); // la première question : l'échauffement, au pavé
check(true, "hors ligne : démarrage et première question");
check(errors.length === 0, `aucune erreur de page${errors.length ? " — " + errors.join(" | ") : ""}`);
await browser.close(); srv.close();
process.exit(ok ? 0 : 1);
