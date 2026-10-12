// LE PILOTE DE L'APPLICATION, pour un agent qui joue l'enfant (lot « Recette de l'enfant et nettoyage des couches », point 4 ;
// docs/LOTS.md, fiche 9). Garde un Chromium ouvert sur l'application, à vitesse réelle (la vraie voix, les vrais délais), et
// répond à des commandes HTTP simples ; chaque commande est notée dans le journal, chaque capture gardée.
//   node tests/recette-fonctionnelle/pilote.mjs [--port 8790] [--out dossier] [--tablette] [--base-un-mois]
// Les coordonnées sont celles de la scène : 1280 × 800, (0, 0) en haut à gauche, quelle que soit la taille de l'écran.
//   curl "localhost:8790/capture?nom=accueil"          une capture (le chemin du fichier est rendu)
//   curl "localhost:8790/toucher?x=640&y=400"           un toucher bref
//   curl "localhost:8790/toucher?x=640&y=400&n=3&ecart=80"   plusieurs touchers rapides
//   curl "localhost:8790/appui?x=640&y=400&ms=1500"     un appui long
//   curl "localhost:8790/glisser?x1=880&y1=410&x2=500&y2=690&ms=600"   un doigt qui glisse
//   curl "localhost:8790/deuxdoigts?x1=300&y1=300&x2=900&y2=500"       deux doigts posés ensemble
//   curl "localhost:8790/attendre?ms=3000"
//   curl "localhost:8790/etat"        ce qui est à l'écran : boutons visibles (nom, centre), bulle, phrases dites depuis la dernière fois, erreurs
//   curl "localhost:8790/veille?ms=10000"    l'écran éteint puis rallumé
//   curl "localhost:8790/recharger"
//   curl "localhost:8790/fin"         ferme tout
import { accueilReel, chromium, demarrageReel, finReelle } from "../e2e/navigateur.mjs";
import { createServer } from "node:http";
import { appendFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PORT = Number(arg("--port", 8790)), OUT = resolve(arg("--out", "tests/recette-fonctionnelle/out-enfant/captures")); mkdirSync(OUT, { recursive: true });
const VUE = args.includes("--tablette") ? { width: 1138, height: 711, deviceScaleFactor: 2.25 } : { width: 1280, height: 800, deviceScaleFactor: 1 };
const JOURNAL = join(OUT, "journal.txt"), note = (t) => appendFileSync(JOURNAL, `${new Date().toISOString().slice(11, 19)} ${t}\n`);

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const context = await browser.newContext({ viewport: { width: VUE.width, height: VUE.height }, deviceScaleFactor: VUE.deviceScaleFactor, hasTouch: true });
await demarrageReel(context); await accueilReel(context); await finReelle(context);
await context.addInitScript(() => { window.__phrases = []; const poser = () => { const v = window.__app?.voice; if (!v) return setTimeout(poser, 100); const say = v.say.bind(v); v.say = (t, o) => { window.__phrases.push(t); return say(t, o); }; }; poser(); });
const page = await context.newPage(), cdp = await context.newCDPSession(page), erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message)); page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) erreurs.push(m.text()); });
await page.goto(url + "?nosw");
if (args.includes("--base-un-mois")) {
  const SAVE = resolve("tests/e2e/out/enfant/base-un-mois.json");
  if (!existsSync(SAVE)) execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", SAVE], { stdio: "ignore" });
  await page.waitForFunction(() => window.__app?.store, null, { timeout: 120000 });
  await page.evaluate(async (d) => { await window.__app.store.restore(d, ["reglages"]); }, JSON.parse(readFileSync(SAVE, "utf8")));
  await page.reload();
}
// de la scène (1280 × 800) à l'écran
const ecran = async (x, y) => page.evaluate(([x, y]) => { const r = document.getElementById("stage").getBoundingClientRect(), k = r.width / 1280; return [r.left + x * k, r.top + y * k]; }, [x, y]);
const toucher = async (pts) => cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pts.map(([x, y]) => ({ x, y })) });
const lever = () => cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
let nCapture = 0;
const COMMANDES = {
  async capture(q) { const f = join(OUT, `${String(++nCapture).padStart(3, "0")}-${(q.get("nom") ?? "capture").replace(/[^\w-]+/g, "-")}.jpg`); await page.screenshot({ path: f, type: "jpeg", quality: 80, scale: "css" }); return { fichier: f }; },
  // (un toucher bref : le contact et le lever envoyés d'un coup ; séparés par une attente côté Node, sur une machine chargée,
  // ils arrivaient à plus de 0,5 s l'un de l'autre et l'application voyait un appui long : premier passage de l'agent)
  async toucher(q) { const [x, y] = await ecran(+q.get("x"), +q.get("y")), n = +(q.get("n") ?? 1), e = +(q.get("ecart") ?? 120); for (let i = 0; i < n; i++) { await page.touchscreen.tap(x, y); if (i < n - 1) await page.waitForTimeout(e); } return { ok: true }; },
  async appui(q) { const [x, y] = await ecran(+q.get("x"), +q.get("y")); await toucher([[x, y]]); await page.waitForTimeout(+(q.get("ms") ?? 1200)); await lever(); return { ok: true }; },
  async glisser(q) {
    const [x1, y1] = await ecran(+q.get("x1"), +q.get("y1")), [x2, y2] = await ecran(+q.get("x2"), +q.get("y2")), ms = +(q.get("ms") ?? 500), n = 12;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x1, y: y1 }] });
    for (let i = 1; i <= n; i++) { await page.waitForTimeout(ms / n); await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x1 + ((x2 - x1) * i) / n, y: y1 + ((y2 - y1) * i) / n }] }); }
    await lever(); return { ok: true };
  },
  async deuxdoigts(q) { const a = await ecran(+q.get("x1"), +q.get("y1")), b = await ecran(+q.get("x2"), +q.get("y2")); await toucher([a, b]); await page.waitForTimeout(+(q.get("ms") ?? 300)); await lever(); return { ok: true }; },
  async attendre(q) { await page.waitForTimeout(Math.min(60000, +(q.get("ms") ?? 1000))); return { ok: true }; },
  async etat() {
    return page.evaluate(() => {
      const vis = (e) => e.isConnected && e.checkVisibility({ visibilityProperty: true, opacityProperty: true }), st = document.getElementById("stage").getBoundingClientRect(), k = st.width / 1280;
      const boutons = [...document.querySelectorAll("#ui button, .pa button, canvas.recif-dessin, .demarrage")].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { nom: e.getAttribute("aria-label") || e.textContent?.trim().slice(0, 30) || e.className, x: Math.round((r.x + r.width / 2 - st.left) / k), y: Math.round((r.y + r.height / 2 - st.top) / k), l: Math.round(r.width / k), h: Math.round(r.height / k) }; }).filter((b) => b.l > 4);
      const b = window.__app?.bulle?.etat?.(), phrases = (window.__phrases ?? []).splice(0);
      return { boutons, bulle: b?.visible ? b.texte : null, phrases };
    }).then((e) => ({ ...e, erreurs: erreurs.splice(0) }));
  },
  async veille(q) { await cdp.send("Page.setWebLifecycleState", { state: "frozen" }); await page.waitForTimeout(Math.min(600000, +(q.get("ms") ?? 10000))); await cdp.send("Page.setWebLifecycleState", { state: "active" }); return { ok: true }; },
  async recharger() { await page.reload(); return { ok: true }; },
  async fin() { setTimeout(async () => { await browser.close(); srv.close(); process.exit(0); }, 100); return { ok: true }; },
};
createServer(async (req, res) => {
  const u = new URL(req.url, "http://x"), c = COMMANDES[u.pathname.slice(1)];
  if (!c) { res.writeHead(404); res.end(JSON.stringify({ erreur: "commande inconnue", commandes: Object.keys(COMMANDES) })); return; }
  try { const r = await c(u.searchParams); note(`${u.pathname}${u.search}`); res.writeHead(200, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(r, null, 1)); }
  catch (e) { res.writeHead(500); res.end(JSON.stringify({ erreur: e.message.split("\n")[0] })); }
}).listen(PORT, () => console.log(`pilote prêt : http://localhost:${PORT} (captures et journal : ${OUT})`));
