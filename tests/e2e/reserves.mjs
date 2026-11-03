// LES RÉSERVES D'ÉTOILES ET LES ÉTOILES ARC-EN-CIEL (lot « Réserves d'étoiles et étoiles arc-en-ciel », docs/LOTS.md, fiche 17 ;
// décisions du parent du 2 novembre 2026 ; maquette validée : docs/maquettes/reserves/) dans Chromium, tactile. Il passe par chaque
// situation nouvelle et en fait les captures (1280 × 800, 1920 × 1200, la tablette de référence s5e, le petit smartphone) :
//  1. l'accueil : les deux réserves à droite du compteur, leur nombre ; masquée à 0 ; chacune touchée, ce que dit la mascotte ; la
//     bulle ne couvre pas la réserve touchée ; les cibles d'au moins 64 px ;
//  2. pendant une question (la notion du jour) : les réserves visibles mais inertes ; dans l'accueil en pause, elles répondent ;
//  3. la boutique, une créature du récif touchée : les deux coches (étoiles de mer, étoile arc-en-ciel), la seule coche arc-en-ciel,
//     l'étoile gardée pour la prochaine zone ; faire briller avec l'étoile arc-en-ciel (la réserve descend d'un cran, la créature
//     brille ; trois touchers très rapides : un seul achat) ; le changement de prix annoncé une seule fois ;
//  4. la récompense : les étoiles arc-en-ciel volent jusqu'à leur réserve, qui se met à jour ; l'ouverture d'une zone : l'étoile part
//     de la réserve.
// Captures dans tests/e2e/out/reserves/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/reserves.mjs [--out dossier] [--vite]   (--vite : seulement 1280 × 800)
// BANC ANDROID, raccourcis : voix rapide, sans service worker
// (raison : ce parcours vérifie ce que montrent et disent les réserves et la boutique, chaque situation sur une base neuve : à la
// vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application pour chaque situation n'apporterait
// rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur le banc Android (journee.mjs,
// enfant.mjs --android, installation.mjs, veille.mjs).)
import { chromium, finReelle } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";
import { optionsProfil } from "./appareils.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/reserves")); mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))), T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const X = T.reserves, BQ = T.boutique;
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const Q = "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=2&guides=0";
const V1280 = ["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }];
const VUES = args.includes("--vite") ? [V1280] : [V1280, ["1920", { viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1, hasTouch: true }], ["s5e", optionsProfil("s5e")], ["petit-smartphone", optionsProfil("petit-smartphone")]];
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id);

async function fresh(state, vue, { fin = false } = {}) {
  const context = await browser.newContext(vue[1]);
  if (fin) await finReelle(context);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st.recompenses) await s.put("recompenses", r); for (const [k, v] of Object.entries(st.reglages ?? {})) await s.setSetting(k, v); }, state);
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.waitForTimeout(1500);
  return { context, page };
}
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
// `arc` étoiles arc-en-ciel en réserve, `dorees` étoiles de diamant
const etoiles = (total, arc, dorees) => ({ id: "etoiles", total, cumul: total + 400, dorees, doreesDepensees: 0, arcEnCiel: arc + 1, arcDepensees: 1, arcBrillees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });
const etat = (total, arc, dorees, extra = {}) => ({ recompenses: [owned(extra.owned ?? lagon.slice(0, 6)), etoiles(total, arc, dorees), { id: "quota", date: Date.now(), cartes: 9 }], reglages: extra.reglages });
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const saidReset = (page) => page.evaluate(() => { window.__said = []; });
const shot = async (page, vue, nom, ms = 600) => { await page.waitForTimeout(ms); await page.screenshot({ path: join(OUT, `${nom}-${vue[0]}.png`) }); };
// ce que montrent les réserves : le nombre de chaque case visible, sa place, sa taille à l'écran
const reserves = (page) => page.evaluate(() => Object.fromEntries([...document.querySelectorAll(".reserve")].map((e) => { const r = e.getBoundingClientRect(); return [e.classList.contains("arc") ? "arc" : "diamant", { vu: getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility === "visible", n: window.__app.hud.reserves.n[e.classList.contains("arc") ? "arc" : "diamant"], x: r.x, w: r.width, h: r.height, inerte: getComputedStyle(e).pointerEvents === "none" }]; })));
// la bulle (son ovale, en px logiques : engine/bulle.js, place.rect) couvre-t-elle un des éléments `sel` visibles ?
const bulleCouvre = (page, sel) => page.evaluate((sel) => { const B = window.__app.bulle, p = B.place?.rect; if (!p || !B.shown) return false; return [...document.querySelectorAll(sel)].filter((e) => getComputedStyle(e).visibility === "visible" && getComputedStyle(e).display !== "none").some((e) => { const q = [parseFloat(e.style.left), parseFloat(e.style.top), parseFloat(e.style.left) + parseFloat(e.style.width), parseFloat(e.style.top) + parseFloat(e.style.height)]; return !(p[2] <= q[0] || q[2] <= p[0] || p[3] <= q[1] || q[3] <= p[1]); }); }, sel);
async function boutique(page) {
  await tap(page, ".reefkey"); await recifOuvert(page);
  await page.waitForSelector(".boutique-cle", { timeout: 20000 }); await tap(page, ".boutique-cle");
  await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 });
  await page.waitForTimeout(1600);
}
const confs = (page) => page.evaluate(() => [...document.querySelectorAll(".boutique-conf")].filter((b) => getComputedStyle(b).visibility === "visible").map((b) => (b.classList.contains("coche-arc") ? "arc" : b.classList.contains("croix") ? "croix" : "coche")));

for (const vue of VUES) {
  const v = vue[0], tout = v === "1280", Vs = (n) => `${v} : ${n}`;
  // ---------------------------------------------------------------- 1. l'accueil
  {
    const { context, page } = await fresh(etat(260, 4, 2), vue);
    let r = await reserves(page);
    check(r.arc.vu && r.diamant.vu && r.arc.n === 4 && r.diamant.n === 2, Vs(`accueil : les deux réserves, 4 et 2 (${JSON.stringify([r.arc.n, r.diamant.n])})`));
    check(r.arc.x < r.diamant.x, Vs("l'arc-en-ciel d'abord, le diamant à sa droite"));
    const echelle = await page.evaluate(() => document.querySelector("#ui").getBoundingClientRect().width / 1280);
    check(r.arc.w / echelle >= 64 && r.arc.h / echelle >= 64, Vs(`cibles d'au moins 64 px logiques (${Math.round(r.arc.w / echelle)} × ${Math.round(r.arc.h / echelle)})`));
    check(!r.arc.inerte, Vs("à l'accueil, les réserves répondent au toucher"));
    await shot(page, vue, "01-accueil-reserves");
    await saidReset(page); await tap(page, ".reserve.arc"); await page.waitForTimeout(900);
    const attenduArc = "Tu as 4 étoiles arc-en-ciel. " + X.arcZonesEtBriller;
    check((await said(page)).includes(attenduArc), Vs(`l'étoile arc-en-ciel touchée : « ${attenduArc} »`));
    check(!(await bulleCouvre(page, ".reserve.arc")), Vs("la bulle ne couvre pas la réserve touchée"));
    await shot(page, vue, "02-reserve-arc-touchee", 300);
    await saidReset(page); await tap(page, ".reserve.diamant"); await page.waitForTimeout(900);
    const attenduD = "Tu as 2 étoiles de diamant. " + X.diamantQuand.replace("{zone}", "du grand large");
    check((await said(page)).includes(attenduD), Vs(`l'étoile de diamant touchée : « ${attenduD} »`));
    if (tout) await shot(page, vue, "03-reserve-diamant-touchee", 300);
    await context.close();
  }
  if (tout) {
    // masquée à 0 : il n'y a que les étoiles de diamant, leur case prend la première place
    const { context, page } = await fresh(etat(260, 0, 1), vue);
    const r = await reserves(page);
    check(!r.arc.vu && r.diamant.vu && Math.round(r.diamant.x) === 1136, Vs(`sans étoile arc-en-ciel : sa réserve masquée, le diamant à sa place (x ${Math.round(r.diamant.x)})`));
    await shot(page, vue, "04-une-seule-reserve");
    await context.close();
  }
  // ---------------------------------------------------------------- 2. pendant une question, puis dans l'accueil en pause
  if (tout || v === "petit-smartphone") {
    const { context, page } = await fresh(etat(260, 4, 2), vue);
    await tap(page, ".play");
    await page.waitForFunction(() => { const s = window.__app.screen; return !!(s?.q && s.resolve && !s.locked) || !!window.__app.facts?.q; }, null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1500);
    let r = await reserves(page);
    check(r.arc.vu && r.arc.inerte && r.diamant.inerte, Vs(`pendant une question : visibles, inertes (étape ${await page.evaluate(() => window.__app.session?.progress?.etape)})`));
    await saidReset(page); await tap(page, ".reserve.arc").catch(() => {}); await page.waitForTimeout(700);
    check(!(await said(page)).includes("étoiles arc-en-ciel"), Vs("pendant une question, toucher une réserve ne fait rien dire"));
    await shot(page, vue, "05-pendant-une-question");
    // l'accueil en pause
    await tap(page, ".session-home"); await page.waitForTimeout(2000);
    r = await reserves(page);
    check(r.arc.vu && !r.arc.inerte, Vs("dans l'accueil en pause : visibles et touchables"));
    await saidReset(page); await tap(page, ".reserve.arc"); await page.waitForTimeout(250);
    // (relecture du lot, constat 16 : la capture prise pendant que la bulle est là)
    await shot(page, vue, "06-accueil-en-pause", 0);
    await page.waitForTimeout(600);
    check((await said(page)).includes("Tu as 4 étoiles arc-en-ciel."), Vs("dans l'accueil en pause, la réserve répond"));
    await context.close();
  }
  // ---------------------------------------------------------------- 3. la boutique
  {
    // a. 260 étoiles, 4 étoiles arc-en-ciel (une à dépenser) : les deux coches
    const { context, page } = await fresh(etat(260, 4, 2), vue);
    await boutique(page);
    const r0 = await reserves(page);
    check(r0.arc.vu && r0.arc.n === 4, Vs("dans la boutique, les réserves"));
    await saidReset(page); await tap(page, '.boutique-tuile[data-id="crabe"]'); await page.waitForTimeout(900);
    const attendu = "C'est le crabe ! " + BQ.dejaLaIl + " " + BQ.brillerLeArc.replace("{n}", 150) + " " + BQ.choisisCoche;
    check((await said(page)).includes(attendu), Vs(`deux façons : « ${attendu} »`));
    check((await confs(page)).join() === "croix,coche,arc", Vs(`la croix, la coche des étoiles de mer, la coche arc-en-ciel (${(await confs(page)).join()})`));
    check(!(await bulleCouvre(page, ".boutique-conf, .reserve")), Vs("la bulle ne couvre ni les coches ni les réserves"));
    await shot(page, vue, "07-boutique-deux-facons", 1200);
    // faire briller avec l'étoile arc-en-ciel ; trois touchers très rapides : un seul achat
    if (tout) {
      const b = await page.locator(".boutique-conf.coche-arc").boundingBox();
      for (let i = 0; i < 3; i++) await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
      await page.waitForTimeout(500); await shot(page, vue, "08-briller-arc-vol", 0);
      await page.waitForFunction(() => !window.__app.boutique.verrou, null, { timeout: 30000 }); await page.waitForTimeout(800);
      const st = await page.evaluate(async () => ({ total: window.__app.rewards.total, arc: window.__app.rewards.arcDispo, n: window.__app.hud.reserves.n.arc, brillante: window.__app.rewards.owned.crabe.brillante, achats: (await window.__app.store.get("recompenses", "achats")).liste, st: await window.__app.store.get("recompenses", "etoiles") }));
      check(st.brillante && st.total === 260 && st.arc === 3 && st.n === 3, Vs(`faire briller avec l'étoile arc-en-ciel : le crabe brille, 260 étoiles de mer gardées, la réserve à 3 (${JSON.stringify([st.brillante, st.total, st.arc, st.n])})`));
      check(st.achats.length === 1 && st.achats[0].arc === true && st.achats[0].prix === 0 && st.st.arcBrillees === 1, Vs(`trois touchers très rapides : un seul achat, noté « étoile arc-en-ciel » (${st.achats.length})`));
      check((await said(page)).includes(`C'est le crabe ! ${T.carteBrillanteTirage}`), Vs("« C'est le crabe ! Oh ! Elle est brillante ! »"));
      check(!(await bulleCouvre(page, ".reserve, .hud.stars")), Vs("après faire briller, la bulle ne couvre ni le compteur ni les réserves"));
      await shot(page, vue, "09-briller-arc-fait");
      // il ne reste que des étoiles gardées : la tuile suivante le dit
      await saidReset(page); await tap(page, '.boutique-tuile[data-id="crevette"]'); await page.waitForTimeout(900);
      const g = "C'est la crevette ! " + BQ.dejaLaElle + " " + BQ.brillerLa.replace("{n}", 150) + " " + BQ.arcGardees + " " + BQ.daccord;
      check((await said(page)).includes(g), Vs(`l'étoile gardée : « ${g} »`));
      check((await confs(page)).join() === "croix,coche", Vs("l'étoile gardée : seulement la croix et la coche des étoiles de mer"));
      await shot(page, vue, "10-boutique-etoile-gardee", 1200);
    }
    await context.close();
  }
  if (tout || v === "petit-smartphone") {
    // b. pas assez d'étoiles de mer : la seule coche arc-en-ciel
    const { context, page } = await fresh(etat(60, 4, 2), vue);
    await boutique(page);
    await saidReset(page); await tap(page, '.boutique-tuile[data-id="crabe"]'); await page.waitForTimeout(900);
    check((await confs(page)).join() === "croix,arc", Vs(`pas assez d'étoiles de mer : la croix et la coche arc-en-ciel (${(await confs(page)).join()})`));
    check((await said(page)).includes(BQ.dejaLaIl + " " + BQ.brillerLeArcSeul + " " + BQ.daccord) && !(await said(page)).includes("Il te manque") && !(await said(page)).includes("150"), Vs("« Pour le faire briller : une étoile arc-en-ciel. Si tu es d'accord, touche la coche verte. », sans prix impossible ni « il te manque » (relecture, constat 3)"));
    await shot(page, vue, "11-boutique-arc-seule", 1200);
    await context.close();
  }
  if (tout || v === "petit-smartphone") {
    // c. 2 étoiles arc-en-ciel, 3 zones fermées : toutes gardées
    const { context, page } = await fresh(etat(260, 2, 0), vue);
    await boutique(page);
    await saidReset(page); await tap(page, '.boutique-tuile[data-id="crevette"]'); await page.waitForTimeout(900);
    check((await said(page)).includes(BQ.arcGardees), Vs("deux étoiles gardées pour trois zones : « Tes étoiles arc-en-ciel sont gardées… »"));
    check(!(await confs(page)).includes("arc"), Vs("pas de coche arc-en-ciel"));
    await shot(page, vue, "12-boutique-toutes-gardees", 1200);
    await context.close();
  }
  if (tout) {
    // d. le changement de prix : dit une fois, à la visite qui suit
    const { context, page } = await fresh({ recompenses: [owned(lagon.slice(0, 6)), etoiles(260, 0, 0), { id: "quota", date: Date.now(), cartes: 9 }, { id: "boutique", annoncees: [], vues: [], visites: 3 }] }, vue);
    await page.evaluate(() => window.__app.rewards.setPrix("3"));
    await saidReset(page); await boutique(page); await page.waitForTimeout(1500);
    check((await said(page)).includes(BQ.prixChanges), Vs("le niveau de prix changé : « Les prix de la boutique ont changé ! »"));
    await shot(page, vue, "13-prix-changes", 0);
    await tap(page, ".boutique-retour"); await recifOuvert(page); await saidReset(page);
    await tap(page, ".boutique-cle"); await page.waitForFunction(() => window.__app.boutique.open && document.querySelectorAll(".boutique-tuile").length === 15, null, { timeout: 30000 }); await page.waitForTimeout(1500);
    check(!(await said(page)).includes(BQ.prixChanges), Vs("à la visite suivante, plus rien"));
    await context.close();
  }
  // ---------------------------------------------------------------- 4. la récompense
  if (tout || v === "s5e" || v === "petit-smartphone") {
    // une séance jouée ; deux étoiles arc-en-ciel gagnées pendant la séance (posées comme le ferait un niveau franchi) ; toutes les
    // créatures du lagon : le récif de corail s'ouvre, son étoile part de la réserve
    const { context, page } = await fresh(etat(260, 1, 0, { owned: lagon }), vue, { fin: true });
    await tap(page, ".play");
    await page.waitForFunction(() => !!window.__app.session?.rec, null, { timeout: 30000 });
    await page.evaluate(async () => { const a = window.__app; a.session.rec.arcEnCiel = 2; await a.rewards.special("arcEnCiel", 2); });
    const vus = { vol: null, zone: null };
    for (const until = Date.now() + 240000; Date.now() < until;) {
      const st = await page.evaluate(() => { const s = window.__app.screen; return { q: s?.q && !s.locked && s.resolve ? s.q.answer : null, f: s?.q?.format, shell: !!document.querySelector(".shelltap"), check: !!document.querySelector(".check"), card: !!document.querySelector(".card.flipped"), fin: !!document.querySelector(".fin-recompense"), moon: !!document.querySelector(".moon"), vol: document.querySelectorAll(".etoile-vol").length, zone: !!document.querySelector(".card.zone-closed"), n: window.__app.hud.reserves.n.arc }; });
      if (st.fin || st.moon) break;
      if (st.q !== null) { if (st.f === "lire" || st.f === "sauter") await page.tap(`.answer[data-value="${st.q}"]`, { force: true }).catch(() => {}); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); await page.waitForTimeout(200); continue; }
      if (st.vol && !vus.vol) { vus.vol = st.n; await page.waitForTimeout(700); await shot(page, vue, "14-recompense-vol-vers-la-reserve", 0); }
      // (relecture du lot, constat 15 : la capture pendant le vol de l'étoile qui part de la réserve)
      if (st.zone && !vus.zone) { vus.zone = st.n; await shot(page, vue, "15-ouverture-zone-depuis-la-reserve", 1300 / 1); vus.zoneApres = await page.evaluate(() => window.__app.hud.reserves.n.arc); }
      if (st.shell) { await page.waitForTimeout(900); await page.tap(".shelltap", { force: true }); await page.waitForTimeout(300); continue; }
      if (st.card && st.check) { await page.waitForTimeout(1000); await page.tap(".check", { force: true }); await page.waitForTimeout(800); continue; }
      await page.waitForTimeout(120);
    }
    const s = await said(page), fin = await page.evaluate(() => ({ arc: window.__app.rewards.arcDispo, n: window.__app.hud.reserves.n.arc, zones: window.__app.rewards.zones.ouvertes }));
    check(s.includes("2 étoiles arc-en-ciel !") && !s.includes("Un jour, elles t'ouvriront"), Vs("la récompense annonce les deux étoiles arc-en-ciel, sans « Un jour… » : une zone s'ouvre aussitôt (relecture, constat 2)"));
    check(vus.zoneApres === (vus.zone ?? 0) - 1, Vs(`pendant le vol vers le dos de la zone, la réserve a déjà donné son étoile (${vus.zone} → ${vus.zoneApres})`));
    check(vus.vol !== null && vus.vol <= 2, Vs(`pendant le vol, la réserve montre encore le nombre d'avant (${vus.vol})`));
    check(fin.zones.includes("corail") && vus.zone !== null, Vs(`le récif de corail s'ouvre ; à la cérémonie, la réserve a donné son étoile (${vus.zone})`));
    check(fin.arc === 2 && fin.n === 2, Vs(`à la fin, la réserve juste : 1 + 2 − 1 = 2 (${fin.arc}, montré ${fin.n})`));
    await shot(page, vue, "16-fin-reserve-a-jour");
    await context.close();
  }
}
check(!errors.length, `aucune erreur de page (${errors.length}${errors.length ? ` : ${errors[0]}` : ""})`);
await browser.close(); srv.close();
