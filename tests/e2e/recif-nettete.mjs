// LA NETTETÉ DU RÉCIF (lot « Netteté du récif », docs/LOTS.md, fiche 14) : sur le banc Android, profil s5e par défaut (ou
// `--profil petit-smartphone`), le processeur ralenti du profil, toute la collection (60 créatures, dix brillantes) :
//  1. MESURE : l'intervalle moyen entre deux images dans le récif, zone par zone, à chaque niveau d'allègement tenu (le niveau
//     ne bouge pas pendant la mesure), puis la visite libre : quand l'allègement se déclenche, et jusqu'où il descend ;
//  2. CAPTURES : le poisson-clown, l'hippocampe et le crabe, de près, à chaque niveau (pixels de l'appareil, sans agrandir) ;
//  3. CONTRÔLES (sur une version qui a les crans) : les créatures sont dessinées depuis une image déjà réduite à leur taille
//     d'affichage ; chaque allègement est écrit dans le journal technique, avec la densité et l'intervalle mesuré ; les crans
//     viennent dans l'ordre, un par un, et la densité ne baisse qu'après l'allègement des créatures (densité 1 en dernier) ;
//     aucune erreur dans la page.
//   node tests/e2e/recif-nettete.mjs [--profil s5e] [--ralenti n] [--out dossier] [--secondes 5] [--sans-mesure] [--sans-captures]
//   (RACINE_APP=copie de app/ : la même chose sur une autre version, par exemple celle de main, pour les chiffres « avant ».
//    Sur une version sans niveaux d'allègement, `--tenir-avant` : le niveau 0 est tenu par une copie dont le seuil est retiré.)
// BANC ANDROID, raccourcis : sans service worker
// (raison : la mesure porte sur le dessin du récif, une fois l'application chargée ; installer l'application (140 Mo, environ
// une minute) n'y change rien. La vraie voix, le son et la lecture automatique refusée restent ceux du banc. L'application
// installée, relancée, gelée est éprouvée par journee.mjs, installation.mjs et veille.mjs.)
import { chromium, demarrageTouche } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";
import { PROFILS, optionsProfil } from "./appareils.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PROFIL = opt("--profil", "s5e"), P = PROFILS[PROFIL], RALENTI = Number(opt("--ralenti", P?.ralenti ?? 1)), SECONDES = Number(opt("--secondes", 5)), TEST = true;
const OUT = resolve(opt("--out", `tests/e2e/out/recif-nettete/${PROFIL}`)); mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url), "utf8"));
const BRILLANTES = ["crabe", "poisson-clown", "hippocampe", "tortue-verte", "poisson-perroquet", "requin-baleine", "dauphin", "calmar-geant", "poisson-lanterne", "pieuvre-dumbo"];
const ZONES = [["lagon", 0, 2600], ["corail", 2600, 5900], ["large", 5900, 8400], ["abysses", 8400, 10874]];
const PORTRAITS = ["poisson-clown", "hippocampe", "crabe"];
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const stats = (a) => { const s = [...a].sort((x, y) => x - y), q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return a.length ? { n: a.length, moyenne: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), plusDe33ms: a.filter((x) => x > 33.4).length } : { n: 0 }; };

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext(optionsProfil(PROFIL));
await demarrageTouche(context);
// (le travail du fil principal par image : tous les rappels d'image réunis)
await context.addInitScript(() => {
  const raf = window.requestAnimationFrame.bind(window); window.__travail = 0;
  window.requestAnimationFrame = (cb) => raf((t) => { const a = performance.now(); try { cb(t); } finally { window.__travail += performance.now() - a; } });
  // les appels de dessin d'images (drawImage) et les pixels relus dans leurs sources : ce que la carte graphique de la tablette
  // reçoit, indépendamment du rendu logiciel du banc
  const di = CanvasRenderingContext2D.prototype.drawImage; window.__dessins = { n: 0, px: 0 };
  CanvasRenderingContext2D.prototype.drawImage = function (im, ...a) {
    const d = window.__dessins; d.n++;
    d.px += a.length >= 8 ? Math.abs(a[2] * a[3]) : (im.naturalWidth ?? im.width) * (im.naturalHeight ?? im.height);
    return di.call(this, im, ...a);
  };
});
const page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: RALENTI });
const go = async () => { await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 120000 }); };
await go();
await page.evaluate(async ({ ids, br }) => {
  const s = window.__app.store; await s.setSetting("mascotte", "Pili");
  await s.put("recompenses", { id: "cartes", cartes: Object.fromEntries(ids.map((id) => [id, { n: 1, premiere: 1, brillante: br.includes(id) }])) });
  await s.put("recompenses", { id: "zones", ouvertes: ["lagon", "corail", "large", "abysses"], dates: {} });
}, { ids: cartes.cartes.map((c) => c.id), br: BRILLANTES });
await go();

// le récif : entrer (le niveau d'allègement tenu, ou libre : null), sortir ; l'état de son dessin
const nouveau = await page.evaluate(() => typeof window.__app.reef.niveaux === "function");
const NIVEAUX = nouveau ? await page.evaluate(() => window.__app.reef.niveaux()) : [{ nom: "densité 2" }, { nom: "densité 1 (allégé)" }];
const entrer = async (niveau) => {
  await page.evaluate((n) => { window.__recifNiveau = n; }, niveau);
  await page.tap(".reefkey", { force: true }); await recifOuvert(page, 60000);
  // (version sans niveaux : le niveau 1 est la densité 1, posée comme le fait l'allègement)
  if (!nouveau && niveau === 1) await page.evaluate(() => { const r = window.__app.reef; r.lent = true; r.api.resize(); });
};
const sortir = async () => { await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForFunction(() => !window.__app.reef.open, null, { timeout: 20000 }); await page.waitForTimeout(500); };
const dessin = () => page.evaluate(() => {
  const r = window.__app.reef, cv = document.querySelector("canvas.recif-dessin"), st = window.__app.stage.root;
  return { niveau: r.niveau ?? (r.lent ? 1 : 0), densite: +(cv.width / st.clientWidth).toFixed(2), canvas: `${cv.width}×${cv.height}`, reduites: r.reductions?.nombre ?? null };
});
// les intervalles entre deux images, et le travail du fil principal par image (tous les rappels d'image réunis : la mesure
// du dessin du récif lui-même ; le reste de l'intervalle est l'attente de l'affichage)
const intervalles = async (ms, travail = null, dessins = null) => { const r = await page.evaluate((ms) => new Promise((ok) => { const g = [], w = [], d = []; let last = 0, w0 = window.__travail, n0 = window.__dessins.n, p0 = window.__dessins.px; const t0 = performance.now(); const f = (t) => { const D = window.__dessins; if (last) { g.push(t - last); w.push(window.__travail - w0); d.push([D.n - n0, D.px - p0]); } w0 = window.__travail; n0 = D.n; p0 = D.px; last = t; if (t - t0 < ms) requestAnimationFrame(f); else ok({ g, w, d }); }; requestAnimationFrame(f); }), ms); travail?.push(...r.w); dessins?.push(...r.d); return r.g; };
const allerA = (x) => page.evaluate((x) => { const a = window.__app.reef.api; a.camX = x - a.vue.viewW / 2; }, x);
const resultat = { date: new Date().toISOString(), profil: `${PROFIL} : ${P.nom}, ${P.largeur} × ${P.hauteur} px CSS, densité ${P.densite}, processeur ralenti × ${RALENTI}`, version: nouveau ? "avec les niveaux d'allègement" : "sans niveaux (densité 2, puis 1)", niveaux: NIVEAUX, zones: {}, libre: null, erreurs: errors };

// ---- 1. la mesure, zone par zone, à chaque niveau tenu
if (!args.includes("--sans-mesure")) {
  const tenus = nouveau ? NIVEAUX.map((_, i) => i) : args.includes("--tenir-avant") ? [0] : [];
  for (const n of tenus) {
    await entrer(n); const d = await dessin();
    const parZone = {};
    for (const [z, x0, x1] of ZONES) { await allerA((x0 + x1) / 2); await page.waitForTimeout(1500); const w = [], dd = []; parZone[z] = stats(await intervalles(SECONDES * 1000, w, dd)); parZone[z].travail = stats(w).moyenne; parZone[z].appels = Math.round(stats(dd.map((x) => x[0])).moyenne); parZone[z].mpxRelus = +(stats(dd.map((x) => x[1])).moyenne / 1e6).toFixed(2); }
    resultat.zones[`${n} · ${NIVEAUX[n]?.nom ?? n}`] = { ...d, ...parZone };
    console.log(`niveau ${n} (${NIVEAUX[n]?.nom}, densité ${d.densite}) : ${ZONES.map(([z]) => `${z} ${parZone[z].moyenne} ms (travail ${parZone[z].travail}, ${parZone[z].appels} appels, ${parZone[z].mpxRelus} Mpx relus)`).join(", ")}`);
    await sortir();
  }
  // la visite libre : l'entrée par le lagon, puis chaque zone ; seconde par seconde, l'intervalle moyen et le niveau
  await page.evaluate(() => { delete window.__recifNiveau; });
  await page.tap(".reefkey", { force: true }); await page.waitForFunction(() => window.__app.reef?.open && window.__app.reef.api, null, { timeout: 60000 });
  const fil = [];
  for (let s = 0; s < 24; s++) {
    if (s === 8 || s === 13 || s === 18) await allerA(ZONES[s === 8 ? 1 : s === 13 ? 2 : 3][1] + 1200);
    const g = await intervalles(1000), d = await dessin(); fil.push({ s: s + 1, moyenne: stats(g).moyenne, niveau: d.niveau, densite: d.densite });
  }
  const journal = await page.evaluate(() => (window.__journalTechnique ?? []).filter((e) => e.type === "récif").map((e) => ({ message: e.message, densite: e.densiteDessin, intervalleMs: e.intervalleMs, niveau: e.niveauRecif, zone: e.zoneRecif })));
  resultat.libre = { seconde_par_seconde: fil, journal };
  console.log(`visite libre : ${fil.map((f) => `${f.s}s ${f.moyenne}ms→${f.niveau}`).join(" ")}`);
  console.log(`journal : ${JSON.stringify(journal)}`);
  if (TEST && nouveau) {
    check(journal.length > 0 || fil.every((f) => f.niveau === 0), `chaque allègement du récif est écrit dans le journal technique (${journal.length} ligne(s))`);
    check(journal.every((e) => e.densite != null && e.intervalleMs > 33), "chaque ligne du journal donne la densité et l'intervalle mesuré (au-delà de 33 ms)");
    check(journal.every((e, i) => e.niveau === i + 1), `les crans viennent un par un, dans l'ordre (${journal.map((e) => e.niveau).join(", ")})`);
    const d2 = journal.findIndex((e) => e.densite < NIVEAUX[0].densite);
    check(d2 !== 0 && (d2 < 0 || journal.slice(0, d2).some((e) => e.message.includes("ondulation"))), "la densité ne baisse qu'après l'allègement des créatures");
    check(fil.every((f, i) => i === 0 || f.niveau >= fil[i - 1].niveau), "le récif ne remonte pas pendant la visite");
  }
  await sortir();
}

// ---- 2. les captures, de près, à chaque niveau
if (!args.includes("--sans-captures")) {
  const n = nouveau ? NIVEAUX.length : 2;
  for (let i = 0; i < n; i++) {
    await entrer(i); const d = await dessin();
    if (TEST && nouveau && i === 0) check(d.reduites > 0, `les créatures sont dessinées depuis une image déjà réduite à leur taille (${d.reduites})`);
    for (const id of PORTRAITS) {
      await page.evaluate((k) => window.__app.reef.api.aller(k), id);
      await page.waitForFunction((k) => window.__app.reef.api.ou(k), id, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const pos = await page.evaluate((k) => window.__app.reef.api.ou(k), id), box = await page.locator("canvas.recif-dessin").boundingBox();
      if (!pos) { check(false, `${id} visible`); continue; }
      const w = 230, h = 190, x = Math.max(0, Math.min(P.largeur - w, box.x + pos.x - w / 2)), y = Math.max(0, Math.min(P.hauteur - h, box.y + pos.y - h * 0.6));
      await page.screenshot({ path: join(OUT, `${id}-niveau-${i}.png`), clip: { x, y, width: w, height: h } });
    }
    await page.screenshot({ path: join(OUT, `lagon-niveau-${i}.png`) });
    console.log(`captures du niveau ${i} (${NIVEAUX[i]?.nom}, densité ${d.densite})`);
    await sortir();
  }
}

if (TEST) check(errors.length === 0, `aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
writeFileSync(join(OUT, "mesures.json"), JSON.stringify({ ...resultat, echecs: fail }, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nfini");
process.exitCode = fail.length ? 1 : 0;
