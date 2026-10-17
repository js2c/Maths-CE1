// L'APPLICATION INSTALLÉE SE RELANCE (lot « Correctifs de l'installation et de la veille », point 1 ; docs/LOTS.md, fiche 12).
// Sur la tablette, l'application installée ne se relançait plus : l'écran de lancement d'Android restait sans fin. La cause :
// le service worker cherchait chaque fichier dans le cache avec `ignoreSearch`, ce qui oblige Chrome à lire toutes les
// entrées du cache (plus de 11 800) à chaque requête. Ce parcours joue comme la tablette, avec un vrai profil de navigateur
// fermé puis rouvert à chaque relance :
//   1. le premier lancement : le service worker met tout en cache ;
//   2. dix relances avec le réseau, puis dix sans réseau (le serveur coupé) ;
//   3. une nouvelle version publiée : dix relances pendant qu'elle s'installe, interrompue à chaque fermeture, puis qu'elle
//      prend la main ;
//   4. le secours du service worker : ni cache ni réseau, la page de secours (« Vérifiez le Wi-Fi… ») ;
//   5. le secours de la page : un chargement bloqué, « Chargement… » puis « Toucher pour réessayer », noté au lancement suivant ;
//   6. le journal technique (point 5) : les lancements et le service worker y sont notés.
// À chaque relance : le temps jusqu'à la première image (l'écran de démarrage) et jusqu'à l'application prête.
//   node tests/e2e/installation.mjs [--racine dossier] [--relances 10] [--seuil 4000]
//   (--racine : servir une autre copie de app/, par exemple celle de main, pour mesurer le défaut d'avant ; les étapes 4 à 6 ne
//   valent que pour le nouveau code)
import { chromium } from "./navigateur.mjs";
import { createServer } from "node:http";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const ROOT = resolve(arg("--racine", "app")) + "/", PREFIX = "/Maths-CE1/", N = Number(arg("--relances", 10)), SEUIL = Number(arg("--seuil", 4000));
const ancien = args.includes("--racine");
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".ogg": "audio/ogg", ".webm": "video/webm", ".woff2": "font/woff2" };
const OUT = "tests/e2e/out/installation"; mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------- le site : deux versions, et le réseau qu'on peut couper
const SW = readFileSync(join(ROOT, "sw.js"), "utf8"), LISTE = JSON.parse(readFileSync(join(ROOT, "sw-files.json"), "utf8"));
const versionDe = (v) => ({ v, sw: SW.replace(/^const VERSION = ".*";$/m, `const VERSION = "${v}";`), liste: JSON.stringify({ ...LISTE, version: v }), version: JSON.stringify({ version: v }) });
const VERSIONS = { A: versionDe("aaaaaaaaaaaa"), B: versionDe("bbbbbbbbbbbb") };
let pub = VERSIONS.A, coupe = false, demandes = 0;
const srv = createServer((req, rsp) => {
  if (coupe) return req.socket.destroy(); // pas de réseau
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!url.startsWith(PREFIX)) { rsp.writeHead(302, { location: PREFIX }); return rsp.end(); }
  const f = url.slice(PREFIX.length) || "index.html"; demandes++;
  const envoyer = (body, type) => { rsp.writeHead(200, { "content-type": type, "cache-control": "no-cache" }); rsp.end(body); };
  if (f === "sw.js") return envoyer(pub.sw, TYPES[".js"]);
  if (f === "sw-files.json") return envoyer(pub.liste, TYPES[".json"]);
  if (f === "version.json") return envoyer(pub.version, TYPES[".json"]);
  let p = normalize(join(ROOT, f)); if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
  try { if (statSync(p).isDirectory()) p = join(p, "index.html"); envoyer(readFileSync(p), TYPES[extname(p)] ?? "application/octet-stream"); } catch { rsp.writeHead(404); rsp.end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${srv.address().port}${PREFIX}`;
console.log(`racine servie : ${ROOT}`);

// ---------------------------------------------------------------- la tablette : un profil fermé et rouvert à chaque relance
const profil = mkdtempSync(join(tmpdir(), "installation-"));
const errors = [];
const lancer = () => chromium.launchPersistentContext(profil, { executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true, args: ["--autoplay-policy=no-user-gesture-required"] });
const etatSW = (page) => page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); const n = (w) => (w ? w.state : null); return { controle: !!navigator.serviceWorker.controller, actif: n(r?.active), attente: n(r?.waiting), installe: n(r?.installing), caches: await caches.keys() }; });
// une relance : le navigateur rouvert, l'application ouverte ; le temps jusqu'à la première image (l'écran de démarrage) et
// jusqu'à l'application prête ; `garder` : la page reste ouverte ce temps (ms) avant la fermeture
const relancer = async (nom, { garder = 0, attente = 120000 } = {}) => {
  const ctx = await lancer(), page = ctx.pages()[0] ?? (await ctx.newPage());
  page.on("pageerror", (e) => errors.push(`${nom} : ${e.message}`));
  const t0 = Date.now(); let r = { nom };
  try {
    await page.goto(url + "?son=non", { timeout: attente });
    // (une nouvelle version qui prend la main recharge la page pendant l'écran de démarrage : on attend la page stable)
    await pret(page, attente);
    r = { nom, ...(await page.evaluate(() => { const m = (n) => Math.round(performance.getEntriesByName(n)[0]?.startTime ?? NaN); return { image: m("demarrage-visible"), pret: m("app-ready"), version: null }; })), total: Date.now() - t0 };
    r.version = await page.evaluate(async () => (await (await fetch("version.json")).json()).version).catch(() => "?");
    r.sw = await etatSW(page);
  } catch (e) { r = { nom, echec: e.message.split("\n")[0], total: Date.now() - t0 }; await page.screenshot({ path: `${OUT}/echec-${nom}.png` }).catch(() => {}); }
  if (garder) await page.waitForTimeout(garder);
  await ctx.close();
  console.log(`     ${nom} : ${r.echec ? `ÉCHEC (${r.echec})` : `première image ${r.image} ms, prête ${r.pret} ms (version ${r.version}${r.sw.attente ? ", une version attend" : ""}${r.sw.installe ? ", une version s'installe" : ""})`}`);
  return r;
};
// (une page qui se recharge pendant l'attente, quand une nouvelle version prend la main : on attend dans la nouvelle)
const pret = async (page, ms = 120000) => { const t0 = Date.now(); for (;;) { const ok = await page.evaluate(() => window.__ready !== undefined).catch(() => false); if (ok) return; if (Date.now() - t0 > ms) throw new Error("pas prête"); await page.waitForTimeout(100); } };
const resume = (l) => { const ok = l.filter((r) => !r.echec), im = ok.map((r) => r.image).sort((a, b) => a - b), pr = ok.map((r) => r.pret).sort((a, b) => a - b); return { n: l.length, ok: ok.length, image: { min: im[0], med: im[im.length >> 1], max: im.at(-1) }, pret: { min: pr[0], med: pr[pr.length >> 1], max: pr.at(-1) } }; };
const mesures = {};

// 1. le premier lancement : rien n'est en cache, le service worker s'installe
{
  const ctx = await lancer(), page = ctx.pages()[0] ?? (await ctx.newPage());
  const t0 = Date.now();
  await page.goto(url + "?son=non"); await pret(page);
  mesures.premier = await page.evaluate(() => ({ image: Math.round(performance.getEntriesByName("demarrage-visible")[0]?.startTime), pret: Math.round(performance.getEntriesByName("app-ready")[0]?.startTime) }));
  for (let i = 0; i < 600; i++) { const e = await etatSW(page); if (e.actif === "activated" && !e.installe) break; await page.waitForTimeout(500); }
  const e = await etatSW(page);
  console.log(`     premier lancement : première image ${mesures.premier.image} ms, prête ${mesures.premier.pret} ms ; installation en ${Math.round((Date.now() - t0) / 1000)} s`);
  check(e.actif === "activated" && e.caches.includes("ocean-aaaaaaaaaaaa"), `premier lancement : le service worker a tout mis en cache (${e.caches.join(", ")})`);
  await ctx.close();
}

// 2. dix relances avec le réseau, dix sans
const avecReseau = []; for (let i = 1; i <= N; i++) avecReseau.push(await relancer(`relance ${i} (réseau)`));
coupe = true;
const sansReseau = []; for (let i = 1; i <= N; i++) sansReseau.push(await relancer(`relance ${i} (sans réseau)`));
coupe = false;
mesures.avecReseau = resume(avecReseau); mesures.sansReseau = resume(sansReseau);
for (const [nom, l] of [["avec le réseau", avecReseau], ["sans réseau", sansReseau]]) {
  const m = resume(l);
  check(m.ok === l.length && l.every((r) => r.sw?.controle), `${l.length} relances ${nom} : toutes servies par le service worker et prêtes (${m.ok}/${l.length})`);
  check(m.image.max <= SEUIL, `${nom} : première image en ${m.image.min} à ${m.image.max} ms (médiane ${m.image.med} ; seuil ${SEUIL} ms) ; prête en ${m.pret.min} à ${m.pret.max} ms (médiane ${m.pret.med})`);
}

// 3. une nouvelle version publiée : on relance pendant qu'elle s'installe (chaque fermeture interrompt son installation, la
// suivante reprend), jusqu'à ce qu'elle prenne la main
pub = VERSIONS.B;
const pendant = [];
for (let i = 1; i <= N; i++) pendant.push(await relancer(`relance ${i} (nouvelle version)`, { garder: 4000 }));
// (puis on la laisse finir son installation, et on relance : elle prend la main)
{
  const ctx = await lancer(), page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(url + "?son=non"); await pret(page);
  for (let i = 0; i < 900; i++) { const e = await etatSW(page); if (e.attente === "installed" || (e.actif === "activated" && e.caches.length === 1 && e.caches[0] === "ocean-bbbbbbbbbbbb")) break; await page.waitForTimeout(500); }
  console.log(`     nouvelle version : ${JSON.stringify(await etatSW(page))}`);
  await ctx.close();
}
for (let i = 1; i <= 2; i++) pendant.push(await relancer(`relance ${N + i} (nouvelle version installée)`));
mesures.pendant = resume(pendant);
check(mesures.pendant.ok === pendant.length, `${pendant.length} relances pendant l'installation de la nouvelle version : toutes prêtes (${mesures.pendant.ok}/${pendant.length})`);
check(mesures.pendant.image.max <= SEUIL, `pendant l'installation : première image en ${mesures.pendant.image.min} à ${mesures.pendant.image.max} ms (médiane ${mesures.pendant.image.med}) ; prête en ${mesures.pendant.pret.min} à ${mesures.pendant.pret.max} ms`);
const derniere = pendant.at(-1);
check(derniere.version === "bbbbbbbbbbbb" && derniere.sw?.caches?.length === 1, `la nouvelle version a pris la main, l'ancien cache est effacé (${derniere.version} ; ${derniere.sw?.caches?.join(", ")})`);

if (!ancien) {
  // 4. le secours du service worker : le cache perdu et pas de réseau ; la page de l'application ne peut venir de nulle part
  {
    const ctx = await lancer(), page = ctx.pages()[0] ?? (await ctx.newPage());
    await page.goto(url + "?son=non"); await pret(page);
    await page.evaluate(async () => { for (const k of await caches.keys()) await caches.delete(k); });
    coupe = true;
    const t0 = Date.now();
    await page.goto(url + "?son=non").catch(() => {});
    const texte = await page.waitForFunction(() => document.body?.innerText.includes("touchez l'écran pour réessayer") && document.body.innerText, null, { timeout: 10000 }).then((h) => h.jsonValue(), () => null);
    const dt = Date.now() - t0;
    await page.screenshot({ path: `${OUT}/secours-service-worker.png` });
    check(!!texte, `ni cache ni réseau : la page de secours du service worker, « Vérifiez le Wi-Fi, puis touchez l'écran pour réessayer », en ${dt} ms`);
    coupe = false;
    await page.locator("body").tap();
    const repart = await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 120000 }).then(() => true, () => false);
    check(repart, "le réseau revenu, un toucher relance l'application");
    await ctx.close();
  }
  // 5. le secours de la page : un chargement qui ne finit pas (sans service worker, un fichier qui ne vient jamais)
  {
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, serviceWorkers: "block" }), page = await ctx.newPage();
    let bloque = true; const retenus = [];
    await page.route("**/assets/art/atlas.json", (r) => (bloque ? retenus.push(r) : r.continue()));
    await page.goto(url + "?son=non&nosw");
    await page.waitForTimeout(3200);
    const a = await page.evaluate(() => document.getElementById("chargement")?.innerText ?? null);
    await page.screenshot({ path: `${OUT}/secours-page-chargement.png` });
    check(/Chargement…/.test(a ?? ""), `un chargement qui tarde : « Chargement… » (${JSON.stringify(a)})`);
    await page.waitForTimeout(13000);
    const b = await page.evaluate(() => document.getElementById("chargement")?.innerText ?? null);
    await page.screenshot({ path: `${OUT}/secours-page-reessayer.png` });
    check(/Toucher pour réessayer/.test(b ?? ""), `au bout de 15 s : « Toucher pour réessayer » (${JSON.stringify(b)})`);
    bloque = false; retenus.forEach((r) => r.abort().catch(() => {}));
    await page.locator("#chargement").tap();
    const repart = await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 120000 }).then(() => true, () => false);
    check(repart && !(await page.evaluate(() => !!document.getElementById("chargement"))), "touché : l'application repart, le secours a disparu");
    await page.waitForTimeout(500);
    const note = await page.evaluate(() => window.__journalTechnique.some((e) => /lancement précédent/.test(e.message)));
    check(note, "le lancement bloqué est noté dans le journal technique au lancement suivant");
    await browser.close();
  }
  // 6. le journal technique : les lancements (temps jusqu'à la première image) et le service worker
  {
    const ctx = await lancer(), page = ctx.pages()[0] ?? (await ctx.newPage());
    await page.goto(url + "?son=non"); await pret(page);
    await page.waitForTimeout(500);
    const j = await page.evaluate(async () => (await import("./js/engine/journal.js")).lire());
    writeFileSync(`${OUT}/journal.json`, JSON.stringify(j, null, 1));
    const lancements = j.filter((e) => e.type === "lancement" && e.premiereImageMs !== undefined), sw = j.filter((e) => e.source === "service worker");
    check(lancements.length >= 5 && lancements.every((e) => e.premiereImageMs > 0 && e.version), `journal : ${lancements.length} lancements notés, avec le temps jusqu'à la première image et la version`);
    check(["installation commencée", "installation finie", "version activée"].every((m) => sw.some((e) => e.message === m)) && sw.some((e) => e.version === "bbbbbbbbbbbb"), `journal : le service worker (${[...new Set(sw.map((e) => e.message))].join(", ")})`);
    check(j.length <= 300, `journal : au plus 300 événements (${j.length})`);
    await ctx.close();
  }
}

writeFileSync(`${OUT}/mesures${ancien ? "-avant" : ""}.json`, JSON.stringify({ racine: ROOT, mesures, avecReseau, sansReseau, pendant }, null, 1));
check(!errors.length, `aucune erreur dans les pages${errors.length ? ` (${errors.slice(0, 3).join(" | ")})` : ""}`);
srv.close(); rmSync(profil, { recursive: true, force: true });
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ninstallation : chaque relance s'affiche vite, avec ou sans réseau, pendant une mise à jour comme après");
process.exitCode = fail.length ? 1 : 0;
