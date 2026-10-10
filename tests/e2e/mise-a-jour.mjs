// LA MISE À JOUR DE L'APPLICATION ET LA VOIX (lot « Correctifs : passage de l'échauffement aux voiliers », point 12 ; docs/LOTS.md,
// fiche 8). Le parent a entendu « les multiplications » dites par l'ancienne voix (capture 07) : la synthèse du navigateur,
// qui lisait une phrase dont le fichier n'était pas lisible. Ce parcours sert DEUX VERSIONS de l'application en local et
// joue comme la tablette :
//   1. la version A est publiée ; on l'ouvre, son service worker met tout en cache ;
//   2. la version B est publiée : une phrase a un son changé (nouveau nom de fichier ; l'ancien est retiré du site), une
//      phrase est nouvelle ;
//   3. on rouvre l'application et on joue (la page A, servie par le cache, pendant que B s'installe en arrière-plan) : la
//      phrase au son changé est dite ;
//   4. on relance : l'écran de démarrage, puis la version B ; la phrase au son changé et la phrase nouvelle sont dites.
// Il note chaque phrase qui n'a pas été lue depuis son fichier, et pourquoi, et échoue s'il y en a une. Il vérifie aussi
// qu'une page ne mélange jamais deux versions, et que l'installation résiste au réseau : des requêtes qui échouent une
// fois (reprises), puis une version C dont un fichier manque (l'installation échoue, la tablette reste sur B), suivie d'une
// version D réparée (l'installation reprend là où C s'était arrêtée).
//   node tests/e2e/mise-a-jour.mjs [--racine dossier] [--reseau-parfait] [--court] [--forcer]   (--racine : servir une autre copie de app/,
//   par exemple celle de main, pour voir le défaut d'avant le correctif ; --reseau-parfait : aucune requête n'échoue ; --court :
//   sans les versions C et D)
import { accueilReel, chromium, demarrageReel, voixPermise } from "./navigateur.mjs";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const ROOT = resolve(arg("--racine", "app")) + "/", PREFIX = "/Maths-CE1/";
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".ogg": "audio/ogg", ".webm": "video/webm", ".woff2": "font/woff2" };

// ---------------------------------------------------------------- les versions publiées
const lire = (f) => readFileSync(join(ROOT, f));
const A = { sw: lire("sw.js").toString(), liste: JSON.parse(lire("sw-files.json")), index: JSON.parse(lire("assets/voix/index.json")) };
const entrees = Object.entries(A.index.phrases).filter(([, [f]]) => existsSync(join(ROOT, "assets/voix", f)));
// la phrase dont le son change, et celle dont on prend les sons (un autre enregistrement : « un son changé »)
const [X, [xf, xms]] = entrees.find(([p]) => /^[A-Z].{10,40}\.$/.test(p)), [, [autre]] = entrees.find(([p, [f]]) => f !== xf && p.length > 20), [, [autre2]] = entrees.find(([, [f]]) => f !== xf && f !== autre);
const Z = "Une phrase nouvelle de la version B.", YF = "b0b0b0b0b0b0.ogg", ZF = "c0c0c0c0c0c0.ogg";
voixPermise(/^Une phrase nouvelle de la version B\.$/);
const versionDe = (nom, { manque = null } = {}) => {
  const index = { ...A.index, phrases: { ...A.index.phrases, [X]: [YF, xms], [Z]: [ZF, 1500] } };
  const files = A.liste.files.filter((f) => f !== `assets/voix/${xf}` && f !== "version.json").concat([`assets/voix/${YF}`, `assets/voix/${ZF}`, "version.json"]);
  return { nom, sw: A.sw.replace(/^const VERSION = ".*";$/m, `const VERSION = "${nom}";`), liste: { version: nom, files }, index, version: { version: nom }, retire: `assets/voix/${xf}`, extra: { [`assets/voix/${YF}`]: lire(`assets/voix/${autre}`), [`assets/voix/${ZF}`]: lire(`assets/voix/${autre2}`) }, manque };
};
const VERSIONS = {
  A: { nom: "A", sw: A.sw.replace(/^const VERSION = ".*";$/m, 'const VERSION = "aaaaaaaaaaaa";'), liste: { ...A.liste, version: "aaaaaaaaaaaa" }, index: A.index, version: { version: "aaaaaaaaaaaa" }, retire: null, extra: {} },
  B: versionDe("bbbbbbbbbbbb"),
  C: versionDe("cccccccccccc", { manque: "assets/art/atlas.json" }), // un fichier introuvable : l'installation de C échoue
  D: versionDe("dddddddddddd"),
};
let pub = VERSIONS.A, echecsUneFois = false;
const demandes = new Map(), dejaEchoue = new Set();
const srv = createServer((req, rsp) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!url.startsWith(PREFIX)) { rsp.writeHead(302, { location: PREFIX }); return rsp.end(); }
  const f = url.slice(PREFIX.length) || "index.html";
  demandes.set(f, (demandes.get(f) ?? 0) + 1);
  const envoyer = (body, type) => { rsp.writeHead(200, { "content-type": type, "cache-control": "no-cache" }); rsp.end(body); };
  // des requêtes qui échouent une fois (le réseau de la tablette) : les reprises de l'installation les rattrapent
  if (echecsUneFois && /^assets\//.test(f) && f.length % 9 === 0 && !dejaEchoue.has(f)) { dejaEchoue.add(f); rsp.writeHead(503); return rsp.end(); }
  if (pub.manque === f || pub.retire === f) { rsp.writeHead(404); return rsp.end(); }
  if (f === "sw.js") return envoyer(pub.sw, TYPES[".js"]);
  if (f === "sw-files.json") return envoyer(JSON.stringify(pub.liste), TYPES[".json"]);
  if (f === "version.json") return envoyer(JSON.stringify(pub.version), TYPES[".json"]);
  if (f === "assets/voix/index.json") return envoyer(JSON.stringify(pub.index), TYPES[".json"]);
  if (pub.extra[f]) return envoyer(pub.extra[f], TYPES[".ogg"]);
  let p = normalize(join(ROOT, f)); if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
  try { if (statSync(p).isDirectory()) p = join(p, "index.html"); envoyer(readFileSync(p), TYPES[extname(p)] ?? "application/octet-stream"); } catch { rsp.writeHead(404); rsp.end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${srv.address().port}${PREFIX}`;
console.log(`racine servie : ${ROOT} ; phrase au son changé : « ${X} » (${xf} -> ${YF})`);

// ---------------------------------------------------------------- la tablette
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
await accueilReel(context);
const errors = [], manques = [];
const nouvellePage = async () => {
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { const t = m.text(); if (/phrase sans voix/.test(t)) manques.push(t); });
  return page;
};
const ouvrir = async () => {
  const page = await nouvellePage();
  await page.goto(url + "?son=non");
  // (après l'étape 4, l'écran de démarrage est le vrai : on le touche)
  await page.waitForFunction(() => window.__ready !== undefined || !!document.querySelector(".demarrage.pret"), null, { timeout: 120000 });
  if (await page.evaluate(() => window.__ready === undefined && window.__demarrageAuto === false)) await page.locator(".demarrage").tap({ force: true });
  await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  await brancher(page);
  return page;
};
// chaque phrase qui n'a pas été lue depuis son fichier, avec sa cause : le nouveau code la note (onManque) ; l'ancien code la
// lisait par la synthèse du navigateur, ce que montre speechSynthesis.speak
const brancher = async (page) => {
  await page.evaluate(() => {
    window.__manques = []; const v = window.__app.voice;
    const miss = v.miss.bind(v); v.miss = (s, cause = "absente de l'index (synthèse)") => { window.__manques.push([s, cause]); return miss(s, cause); };
    if (window.speechSynthesis) { const sp = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u) => { if (u.text.trim()) window.__manques.push([u.text, "dite par la synthèse du navigateur"]); return sp(u); }; }
  });
};
const etatSW = (page) => page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); const n = (w) => w ? new URL(w.scriptURL).pathname + " " + w.state : null; return { controle: !!navigator.serviceWorker.controller, actif: n(r?.active), attente: n(r?.waiting), installe: n(r?.installing), caches: await caches.keys() }; });
const attendreSW = async (page, quoi, ms = 300000) => { const t0 = Date.now(); for (;;) { const e = await etatSW(page); if (quoi(e)) return e; if (Date.now() - t0 > ms) return e; await page.waitForTimeout(500); } };
const versionPage = (page) => page.evaluate(async () => (await (await fetch("version.json")).json()).version);
const dire = (page, t) => page.evaluate(async (t) => { const n = window.__manques.length; await window.__app.voice.say(t); return window.__manques.slice(n); }, t);

// 1. la version A, mise en cache
let page = await ouvrir();
let e = await attendreSW(page, (s) => s.actif?.endsWith("activated") && !s.installe);
await page.close(); page = await ouvrir();
e = await etatSW(page);
check(e.controle && e.caches.includes("ocean-aaaaaaaaaaaa"), `A : servie par son service worker, mise en cache (${e.caches.join(", ")})`);
const avant = await dire(page, X);
check(!avant.length, `A : « ${X} » lue depuis son fichier`);
await page.close();

// 2. la version B est publiée ; 3. on rouvre et on joue (avec un réseau qui échoue parfois : reprises)
pub = VERSIONS.B; echecsUneFois = !args.includes("--reseau-parfait");
page = await ouvrir();
// (B s'installe en arrière-plan pendant qu'on joue : on suit son installation jusqu'au bout, réussie ou non)
const suivre = (page) => page.evaluate(async () => {
  const r = await navigator.serviceWorker.getRegistration(); window.__etatNouvelle = [];
  const noter = (w) => { if (!w) return; window.__etatNouvelle.push(w.state); w.addEventListener("statechange", () => window.__etatNouvelle.push(w.state)); };
  r.addEventListener("updatefound", () => noter(r.installing)); noter(r.installing);
  await r.update().catch(() => {});
});
const fini = (page) => page.evaluate(() => { const l = window.__etatNouvelle ?? []; return l.length && ["installed", "activated", "redundant"].includes(l.at(-1)) ? l.join(" > ") : null; });
await suivre(page);
const pendant = [];
const t0 = Date.now();
let issue = null;
while (Date.now() - t0 < 300000) {
  pendant.push(...(await dire(page, X)));
  if ((issue = await fini(page))) break;
  await page.waitForTimeout(800);
}
// (on continue de jouer quelques secondes : c'est là qu'une version qui prend la main en cours de partie se voit)
// (entre deux phrases, un moment de silence : une version qui prend la main en profite, comme sur la tablette)
for (let i = 0; i < 3; i++) { await page.waitForTimeout(3000); pendant.push(...(await dire(page, X))); }
// (--forcer : la nouvelle version prend la main maintenant, en pleine partie, comme l'ancien code le faisait dès qu'il le
// pouvait (skipWaiting, clients.claim) ; dans ce Chromium sans écran, une lecture en cours retarde cette prise de main, que la
// tablette fait au premier moment de calme. Sert à montrer le défaut d'avant le correctif : le nouveau code ne prend jamais
// la main en pleine partie, et l'option n'a de sens qu'avec --racine.)
if (args.includes("--forcer") && (await etatSW(page)).attente) {
  const cdp = await context.newCDPSession(page); await cdp.send("ServiceWorker.enable");
  await cdp.send("ServiceWorker.skipWaiting", { scopeURL: url }); await page.waitForTimeout(2500);
  console.log(`     prise de main forcée : ${JSON.stringify(await etatSW(page))}`);
  for (let i = 0; i < 2; i++) { pendant.push(...(await dire(page, X))); await page.waitForTimeout(1000); }
}
console.log(`     installation de B : ${issue ?? "pas finie"}`);
pendant.push(...(await dire(page, X)));
e = await etatSW(page);
console.log(`     après l'installation de B : ${JSON.stringify(e)}`);
check(!pendant.length, `B publiée, la page A joue pendant que B s'installe puis attend : « ${X} » toujours lue depuis son fichier${pendant.length ? ` (${pendant.map(([s, c]) => `« ${s} » : ${c}`).join(" ; ")})` : ""}`);
check((await versionPage(page)) === "aaaaaaaaaaaa", "la page ouverte reste toute entière en version A (pas de mélange)");
check(e.attente?.includes("activated") === false && !!e.attente && e.caches.includes("ocean-aaaaaaaaaaaa"), "B a fini de s'installer malgré les échecs réseau, et attend ; l'ancien cache est gardé");
await page.close();

// 4. on relance : l'écran de démarrage (réel), avant le toucher la version B prend la main, la page se recharge
await demarrageReel(context);
page = await nouvellePage();
let recharges = 0; page.on("load", () => recharges++);
await page.goto(url + "?son=non");
// (le nouveau code recharge la page pendant l'écran de démarrage, une fois B active ; on attend que la page soit stable)
for (let i = 0; i < 240; i++) { const ok = await page.evaluate(() => !!document.querySelector(".demarrage.pret")).catch(() => false); if (ok) break; await page.waitForTimeout(500); }
await page.waitForTimeout(1500);
const vB = await versionPage(page);
check(vB === "bbbbbbbbbbbb", `relancée : la version B (${vB} ; ${recharges - 1} rechargement(s) pendant l'écran de démarrage)`);
await page.locator(".demarrage").tap({ force: true }).catch(() => {});
await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
await brancher(page);
const apres = [...(await dire(page, X)), ...(await dire(page, Z))];
check(!apres.length, `B : « ${X} » (son changé) et « ${Z} » (nouvelle) lues depuis leurs fichiers${apres.length ? ` (${apres.map(([s, c]) => `« ${s} » : ${c}`).join(" ; ")})` : ""}`);
e = await etatSW(page);
check(e.caches.length === 1 && e.caches[0] === "ocean-bbbbbbbbbbbb", `l'ancien cache supprimé une fois B active (${e.caches.join(", ")})`);
await page.close();

// 5. une version C dont un fichier manque : l'installation échoue, la tablette reste sur B ; puis D, réparée
if (!args.includes("--court")) {
  echecsUneFois = false; pub = VERSIONS.C;
  page = await ouvrir();
  await suivre(page);
  for (let i = 0; i < 600 && !(await fini(page)); i++) await page.waitForTimeout(500);
  e = await etatSW(page);
  check(!e.attente && e.actif?.endsWith("activated") && (await versionPage(page)) === "bbbbbbbbbbbb", `C (un fichier introuvable) : son installation échoue (${await fini(page)}), la tablette reste sur B (${JSON.stringify(e)})`);
  const partiel = await page.evaluate(async () => (await (await caches.open("ocean-cccccccccccc")).keys()).length);
  await page.close();
  pub = VERSIONS.D; demandes.clear();
  page = await ouvrir();
  await suivre(page);
  for (let i = 0; i < 600 && !(await fini(page)); i++) await page.waitForTimeout(500);
  e = await etatSW(page);
  const n = [...demandes.entries()].filter(([f]) => /^assets\/(art|voix)\//.test(f)).reduce((a, [, k]) => a + k, 0);
  check(!!e.attente, `D : installée ensuite, elle attend le lancement suivant (${JSON.stringify(e)})`);
  check(partiel > 0, `C avait déjà rangé ${partiel} fichiers ; les sons déjà en cache ne sont pas retéléchargés (${n} demandes d'images et de sons pour D)`);
  await page.close();
}

check(!errors.length, `aucune erreur dans les pages${errors.length ? ` (${errors[0]})` : ""}`);
console.log(manques.length ? `     notées pour l'espace parent : ${manques.length}` : "     aucune phrase notée « sans voix »");
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nmise à jour : aucune phrase sans son fichier, aucune page mêlant deux versions");
process.exitCode = fail.length ? 1 : 0;
