// LOT « NOUVEAUX BOUTONS, MASCOTTE DU RÉCIF ET ÉTOILES » (docs/LOTS.md, fiche 25 ; décisions du parent du 7 novembre 2026) : le
// parcours du lot. Il passe par chaque écran touché et en fait les captures (1280 × 800, 1920 × 1200, la tablette de référence s5e,
// le petit smartphone), et les gros plans de chaque bouton à sa taille réelle (s5e, petit smartphone) :
//  1. les boutons du parent (engine/boutons.js) : chaque usage a son image (pas l'ancien dessin) ; chaque bouton rond est un cercle
//     exact : le doigt est pris en son centre et près de son bord, jamais dans le coin de son carré ; les boutons ronds d'un même écran
//     ne se chevauchent pas, leur entourage de sélection (12 px au-dehors) non plus ; l'accueil (en deux touchers : l'entourage),
//     l'accueil après la séance du jour (« encore »), l'accueil en pause (« continuer »), choisir (les exercices, l'entourage, le
//     retour de l'étape du niveau), le récif (la maison, le livre, la boutique), l'album (la sortie, les zones et le halo de la zone
//     montrée), la boutique (le retour, les onglets, le petit récif des tuiles) ;
//  2. la mascotte vivante dans le récif, à la place de la petite tête : elle ne cache ni bouton ni créature touchable, se touche et
//     parle (ses deux lecteurs vidéo, pas un de plus) ;
//  3. la réserve arc-en-ciel à 0, toutes les zones ouvertes : « Tu n'as pas encore d'étoile arc-en-ciel. » ;
//  4. les étoiles arc-en-ciel et de diamant, en petit (les compteurs) et en grand (gros plans).
// Captures dans tests/e2e/out/nouveaux-boutons/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/nouveaux-boutons.mjs [--vite]   (--vite : seulement 1280 × 800)
// BANC ANDROID, raccourcis : voix rapide, sans service worker
// (raison : chaque situation part d'une base neuve ; à la vitesse réelle de la voix le parcours durerait plusieurs fois plus longtemps,
// et installer l'application n'apporterait rien à ce qu'il vérifie, la forme et la place des boutons. La vraie voix et l'application
// installée sont éprouvées par journee.mjs, enfant.mjs --android, installation.mjs.)
// (sans le problème du jour, `sans=probleme` : il n'est pas l'objet de ce parcours)
import { accueilReel, chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { ilYaSemaines, recifOuvert } from "./recif-commun.mjs";
import { optionsProfil } from "./appareils.mjs";
import { USAGES } from "../../app/js/engine/boutons.js";

const args = process.argv.slice(2);
const OUT = resolve("tests/e2e/out/nouveaux-boutons"); mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url), "utf8"));
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url), "utf8"));
const INDEX = JSON.parse(readFileSync(new URL("../../app/assets/boutons/index.json", import.meta.url), "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [], fail = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) fail.push(msg); };
const Q = "?nosw&voix=rapide&sans=probleme&sansReprise";
const V1280 = ["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }];
const VUES = args.includes("--vite") ? [V1280] : [V1280, ["1920", { viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1, hasTouch: true }], ["s5e", optionsProfil("s5e")], ["petit-smartphone", optionsProfil("petit-smartphone")]];
const GROS_PLANS = new Set(["s5e", "petit-smartphone"]);
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id);
const toutes = cartes.cartes.filter((c) => c.rarete !== "legendaire").map((c) => c.id);
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
const etoiles = (total, o = {}) => ({ id: "etoiles", total, cumul: total + 400, dorees: 0, doreesDepensees: 0, arcEnCiel: 1, arcDepensees: 1, arcBrillees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0, ...o });

async function ouvrir(vue, etat, q = Q, { reel = true } = {}) {
  const context = await browser.newContext(vue[1]);
  if (reel) await accueilReel(context);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => !!window.__app?.store, null, { timeout: 60000 });
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put(r.magasin ?? "recompenses", r.v ?? r); }, etat);
  await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { context, page };
}
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const shot = async (page, vue, nom, ms = 500) => { await page.waitForTimeout(ms); await page.screenshot({ path: join(OUT, `${nom}-${vue[0]}.png`) }); };
// les boîtes visibles d'un sélecteur, en px logiques de la scène (1280 × 800)
const boites = (page, sel) => page.evaluate((s) => { const ui = document.querySelector("#ui").getBoundingClientRect(), k = ui.width / 1280; return [...document.querySelectorAll(s)].filter((e) => e.checkVisibility({ visibilityProperty: true }) && !e.closest(".stash")).map((e) => { const r = e.getBoundingClientRect(); return { x: (r.x - ui.x) / k, y: (r.y - ui.y) / k, w: r.width / k, h: r.height / k }; }); }, sel);
// (le gros plan d'un bouton, à la densité de l'appareil : une découpe de l'écran, 20 px de marge pour l'entourage ; un bouton qui se
// balance ne serait jamais « stable » pour une capture d'élément)
const gros = async (page, vue, sel, nom) => { if (!GROS_PLANS.has(vue[0])) return; const b = await page.locator(sel).first().boundingBox(); if (!b) return; const v = page.viewportSize(), x = Math.max(0, b.x - 20), y = Math.max(0, b.y - 20); await page.screenshot({ path: join(OUT, `gros-${nom}-${vue[0]}.png`), clip: { x, y, width: Math.min(v.width - x, b.width + 40), height: Math.min(v.height - y, b.height + 40) } }); };

// LES BOUTONS RONDS DE L'ÉCRAN : chacun un cercle (border-radius 50 %, carré), le doigt pris au centre et à 0,9 rayon, jamais dans le
// coin du carré (à 0,95 rayon en diagonale : hors du cercle) ; deux boutons ronds visibles ne se chevauchent pas, leurs entourages
// (12 px au-dehors, un seul à la fois) ne touche pas le voisin ; chaque usage dessiné a son image du parent
async function ronds(page, vue, ou, attendus, portee = "#ui .rond") {
  const r = await page.evaluate(([att, portee]) => {
    const ui = document.querySelector("#ui").getBoundingClientRect(), k = ui.width / 1280, out = [];
    for (const e of document.querySelectorAll(portee)) {
      if (!e.checkVisibility({ visibilityProperty: true }) || e.closest(".stash")) continue;
      const b = e.getBoundingClientRect(), cx = b.x + b.width / 2, cy = b.y + b.height / 2, R = b.width / 2;
      const prend = (x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t)); };
      // (un voisin posé par-dessus, la bulle, ne compte pas : elle laisse passer le doigt)
      out.push({ cls: e.className, carre: Math.abs(b.width - b.height) < 0.5, rayon: getComputedStyle(e).borderRadius, centre: prend(cx, cy),
        bords: [0, 1, 2, 3].every((i) => prend(cx + Math.cos(i * Math.PI / 2 + 0.3) * R * 0.88, cy + Math.sin(i * Math.PI / 2 + 0.3) * R * 0.88)),
        coins: [[1, 1], [1, -1], [-1, 1], [-1, -1]].some(([sx, sy]) => prend(cx + sx * R * 0.95, cy + sy * R * 0.95)),
        c: [(cx - ui.x) / k, (cy - ui.y) / k, R / k] });
    }
    return { out, manque: att.filter((s) => !document.querySelector(s)) };
  }, [attendus, portee]);
  check(!r.manque.length, `${vue[0]} ${ou} : les boutons attendus sont là${r.manque.length ? ` (manquent : ${r.manque.join(", ")})` : ""}`);
  check(r.out.length >= attendus.length && r.out.every((b) => b.carre && b.rayon === "50%"), `${vue[0]} ${ou} : ${r.out.length} boutons ronds, chacun un cercle`);
  check(r.out.every((b) => b.centre && b.bords), `${vue[0]} ${ou} : le doigt est pris au centre et près du bord de chacun${r.out.filter((b) => !(b.centre && b.bords)).map((b) => ` (pas : ${b.cls})`).join("")}`);
  check(r.out.every((b) => !b.coins), `${vue[0]} ${ou} : jamais dans le coin du carré${r.out.filter((b) => b.coins).map((b) => ` (pris : ${b.cls})`).join("")}`);
  const chev = [];
  for (let i = 0; i < r.out.length; i++) for (let j = i + 1; j < r.out.length; j++) { const a = r.out[i].c, b = r.out[j].c; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < a[2] + b[2] + 14) chev.push(`${r.out[i].cls} / ${r.out[j].cls}`); }
  check(!chev.length, `${vue[0]} ${ou} : aucun bouton rond ni son entourage ne touche un voisin${chev.length ? ` (${chev.join(" ; ")})` : ""}`);
  return r.out;
}
// chaque usage a son image (index.json) : sinon l'ancien dessin serait posé
const sansImage = Object.entries(USAGES).filter(([, u]) => !INDEX.images[u.image]?.includes(u.d)).map(([n]) => n);
check(!sansImage.length, `chaque usage a son image du parent (${Object.keys(USAGES).length} usages)${sansImage.length ? ` ; sans : ${sansImage.join(", ")}` : ""}`);

for (const vue of VUES) {
  // ---------------------------------------------------------------- l'accueil
  let { context, page } = await ouvrir(vue, [owned(lagon.slice(0, 6)), etoiles(123), { id: "quota", date: ilYaSemaines(3), cartes: 6 }]);
  await page.waitForTimeout(1500);
  const charge = await page.evaluate(() => [...document.querySelectorAll("#ui .galet")].map((e) => e.dataset.key).filter((k) => !window.__app.sprites.frame(`bouton.accueil.${k}`)?.bouton));
  check(!charge.length, `${vue[0]} accueil : chaque galet a l'image du parent${charge.length ? ` (pas : ${charge.join(", ")})` : ""}`);
  await ronds(page, vue, "accueil", [".galet.play", ".galet.choisir", ".galet.leconskey", ".galet.reefkey"]);
  await shot(page, vue, "01-accueil");
  await page.evaluate(() => window.__app.voice.stop());
  await tap(page, ".galet.choisir"); await page.waitForTimeout(700);
  check(await page.evaluate(() => document.querySelector(".galet.choisir").classList.contains("choisie")), `${vue[0]} accueil : un toucher sélectionne « choisir » (l'entourage, un cercle exact)`);
  await shot(page, vue, "02-accueil-choisir-selectionne", 300);
  for (const k of ["play", "choisir", "leconskey", "reefkey"]) await gros(page, vue, `.galet.${k}`, `accueil-${k}`);
  // ---------------------------------------------------------------- choisir
  await tap(page, ".galet.choisir"); await page.waitForSelector(".choix-ex", { timeout: 20000 }); await page.waitForTimeout(1200);
  await ronds(page, vue, "choisir", [".choix-ex"]);
  await shot(page, vue, "03-choisir");
  await page.evaluate(() => window.__app.voice.stop());
  await tap(page, '.choix-ex[data-key="calcul"]'); await page.waitForTimeout(500);
  await shot(page, vue, "04-choisir-selection", 300);
  for (const k of ["ligne", "additions", "calcul", "voiliers", "multiplication", "etal", "problemes"]) await gros(page, vue, `.choix-ex[data-key="${k}"]`, `choisir-${k}`);
  await tap(page, '.choix-ex[data-key="calcul"]'); await page.waitForSelector(".choix-retour", { timeout: 20000 }); await page.waitForTimeout(800);
  await shot(page, vue, "05-choisir-niveau-retour");
  await gros(page, vue, ".choix-retour", "choisir-retour");
  await tap(page, ".session-home"); await page.waitForSelector(".galet.play", { timeout: 20000 }); await page.waitForTimeout(800);
  // ---------------------------------------------------------------- le récif, l'album, la boutique
  await page.evaluate(() => window.__app.voice.stop());
  await tap(page, ".galet.reefkey"); await page.waitForTimeout(300); if (!(await page.evaluate(() => window.__app.reef?.open))) await tap(page, ".galet.reefkey");
  await recifOuvert(page); await page.waitForTimeout(800);
  await ronds(page, vue, "récif", [".homekey", ".albumkey", ".boutique-cle"]);
  await shot(page, vue, "06-recif");
  for (const k of ["homekey:not(.session-home)", "albumkey", "boutique-cle"]) await gros(page, vue, `.${k}`, `recif-${k.split(":")[0]}`);
  // ---------------------------------------------------------------- 2. la mascotte du récif
  await page.waitForFunction(() => !window.__app.voice.speaking, null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(400);
  const m0 = await page.evaluate(() => { const e = document.querySelector(".mascotte-boucle"), ui = document.querySelector("#ui").getBoundingClientRect(), k = ui.width / 1280, r = e.getBoundingClientRect(); return { vue: getComputedStyle(e).visibility, video: window.__app.ocean.mascotteVisible, anim: e.querySelector("img")?.getAnimations()[0]?.playState, b: [(r.x - ui.x) / k, (r.y - ui.y) / k, r.width / k, r.height / k], videos: document.querySelectorAll("video").length }; });
  check(m0.vue === "visible" && !m0.video && m0.anim === "running", `${vue[0]} récif : au repos, la mascotte est la boucle d'images, qui joue (${JSON.stringify({ vue: m0.vue, video: m0.video, anim: m0.anim })})`);
  check(m0.videos <= 2, `${vue[0]} récif : pas plus de deux lecteurs vidéo (${m0.videos})`);
  const autres = [...(await boites(page, ".homekey, .albumkey, .boutique-cle, .hud.stars, .reserve"))];
  check(autres.every((o) => m0.b[0] + m0.b[2] <= o.x || o.x + o.w <= m0.b[0] || m0.b[1] + m0.b[3] <= o.y || o.y + o.h <= m0.b[1]), `${vue[0]} récif : la mascotte ne couvre aucun bouton ni compteur`);
  // les créatures touchables : dans chaque zone, sur 2 s, aucune ne se tient sous la mascotte (celles qui nagent peuvent y passer)
  const sous = await page.evaluate(async (M) => {
    const api = window.__app.reef.api, cv = document.querySelector("canvas.recif-dessin").getBoundingClientRect(), ui = document.querySelector("#ui").getBoundingClientRect(), k = ui.width / 1280, n = {};
    for (const x of [1300, 4200, 7100, 9600]) { api.camX = x - api.vue.viewW / 2; await new Promise((r) => setTimeout(r, 600));
      for (let t = 0; t < 10; t++) { for (const c of api.vivantes()) { const p = api.ou(c); if (!p) continue; const X = (cv.x + p.x - ui.x) / k, Y = (cv.y + p.y - 12 - ui.y) / k; if (X > M[0] && X < M[0] + M[2] && Y > M[1] && Y < M[1] + M[3]) n[c] = (n[c] ?? 0) + 1; } await new Promise((r) => setTimeout(r, 200)); } }
    return n; }, m0.b);
  check(Object.values(sous).every((v) => v <= 5), `${vue[0]} récif : aucune créature ne se tient sous la mascotte (${JSON.stringify(sous)})`);
  await page.evaluate(() => { window.__app.reef.api.camX = 0; }); await page.waitForTimeout(500);
  await gros(page, vue, ".mascotte-boucle", "recif-mascotte-boucle");
  await page.evaluate(() => { window.__said = []; });
  await tap(page, ".mascotte-boucle"); await page.waitForTimeout(150);
  const m1 = await page.evaluate(() => ({ video: window.__app.ocean.mascotteVisible, boucle: getComputedStyle(document.querySelector(".mascotte-boucle")).visibility, parle: window.__app.voice.speaking, dit: window.__said.join(" | "), bulle: !!window.__app.bulle?.shown, videos: document.querySelectorAll("video").length }));
  check(m1.video && m1.boucle === "hidden" && m1.dit.length > 0 && !m1.bulle, `${vue[0]} récif : touchée, la mascotte parle en vidéo, sans bulle (« ${m1.dit} »)`);
  check(m1.videos <= 2, `${vue[0]} récif : toujours deux lecteurs vidéo au plus (${m1.videos})`);
  await shot(page, vue, "06b-recif-mascotte-parle", 100);
  await page.waitForFunction(() => !window.__app.voice.speaking, null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(300);
  check(await page.evaluate(() => !window.__app.ocean.mascotteVisible && getComputedStyle(document.querySelector(".mascotte-boucle")).visibility === "visible"), `${vue[0]} récif : la phrase finie, la boucle revient`);
  await tap(page, ".albumkey"); await page.waitForFunction(() => window.__app.album?.open, null, { timeout: 20000 }); await page.waitForTimeout(1500);
  await ronds(page, vue, "album", [".album-retour", ".album-tab"], "#ui .album-tab, #ui .album-retour");
  await shot(page, vue, "07-album");
  await gros(page, vue, ".album-retour", "album-retour");
  for (const z of ["lagon", "corail", "large", "abysses"]) await gros(page, vue, `.album-tab[aria-label="${cartes.zones.find((x) => x.id === z).nom}"]`, `album-${z}`);
  await tap(page, ".album-retour"); await page.waitForFunction(() => !window.__app.album.open && window.__app.reef?.open, null, { timeout: 15000 }); await page.waitForTimeout(800);
  await tap(page, ".boutique-cle"); await page.waitForSelector(".boutique-tuile", { timeout: 20000 }); await page.waitForTimeout(1500);
  await ronds(page, vue, "boutique", [".boutique-retour", ".boutique-onglet"]);
  await shot(page, vue, "08-boutique");
  await gros(page, vue, ".boutique-retour", "boutique-retour");
  await gros(page, vue, ".boutique-tuile", "boutique-tuile-coin");
  await context.close();
  // ---------------------------------------------------------------- l'accueil en pause (« continuer »)
  ({ context, page } = await ouvrir(vue, [owned(lagon.slice(0, 6)), etoiles(123), { id: "quota", date: ilYaSemaines(3), cartes: 6 }], Q + "&choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0", { reel: false }));
  await page.waitForTimeout(800); await tap(page, ".galet.play");
  await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
  await page.waitForTimeout(400);
  await ronds(page, vue, "séance", [".session-home"]);
  await gros(page, vue, ".session-home", "seance-maison");
  await tap(page, ".session-home"); await page.waitForSelector(".galet.play.keep", { timeout: 20000 }); await page.waitForTimeout(900);
  await ronds(page, vue, "accueil en pause", [".galet.play.keep", ".galet.choisir.keep", ".galet.leconskey.keep", ".galet.reefkey.keep"]);
  await shot(page, vue, "09-accueil-en-pause");
  await context.close();
  // ---------------------------------------------------------------- l'accueil après la séance du jour (« encore »)
  ({ context, page } = await ouvrir(vue, [owned(lagon.slice(0, 6)), etoiles(123), { id: "quota", date: ilYaSemaines(3), cartes: 6 }, { magasin: "seances", v: { debut: Date.now() - 600000, fin: Date.now() - 60000, dureeS: 540, terminee: true, module: 1, questions: 10, justes: 8, reussite: 0.8, etoiles: 10, etapes: [] } }]));
  await page.waitForTimeout(1500);
  await ronds(page, vue, "accueil, séance faite", [".galet.again", ".galet.leconskey", ".galet.reefkey"]);
  await shot(page, vue, "10-accueil-encore");
  await gros(page, vue, ".galet.again", "accueil-encore");
  await context.close();
  // ---------------------------------------------------------------- 3. la réserve arc-en-ciel vide, toutes les zones ouvertes ; 4. les étoiles
  ({ context, page } = await ouvrir(vue, [owned(toutes.slice(0, 20)), etoiles(240, { arcEnCiel: 3, arcDepensees: 3, dorees: 2, doreesDepensees: 0 }), { id: "zones", ouvertes: ["lagon", "corail", "large", "abysses"], dates: {} }, { id: "quota", date: ilYaSemaines(3), cartes: 20 }]));
  await page.waitForTimeout(1500);
  await page.evaluate(() => { window.__app.voice.stop(); window.__said = []; });
  await tap(page, ".reserve.arc"); await page.waitForTimeout(700);
  const dit = await page.evaluate(() => window.__said.join(" | "));
  check(dit === `${T.reserves.arcZero} ${T.reserves.diamantGagner}` || dit.startsWith(T.reserves.arcZero), `${vue[0]} la réserve arc-en-ciel vide, toutes les zones ouvertes : « ${dit} »`);
  await shot(page, vue, "11-reserve-arc-vide-touchee", 0);
  if (GROS_PLANS.has(vue[0])) { const b = await page.locator(".hud.stars").boundingBox(), r = await page.locator(".reserve.diamant").boundingBox(); await page.screenshot({ path: join(OUT, `gros-compteurs-${vue[0]}.png`), clip: { x: b.x - 6, y: Math.min(b.y, r.y) - 6, width: r.x + r.width - b.x + 12, height: Math.max(b.height, r.height) + 12 } }); }
  await context.close();
}

check(!errors.length, `aucune erreur dans la page${errors.length ? ` (${errors.slice(0, 3).join(" | ")})` : ""}`);
await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} ÉCHEC(S)`); process.exitCode = 1; }
