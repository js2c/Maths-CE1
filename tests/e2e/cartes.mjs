// LES CARTES DU LOT 2 dans Chromium (tablette 1280 × 800, tactile), voix accélérée (docs/SPEC-LOT2.md, section 5).
//  1. Le lagon complet et une étoile arc-en-ciel en réserve : à la récompense, le récif de corail s'ouvre
//     (cérémonie), puis les coquillages donnent des cartes du récif de corail, brillantes (tirage forcé) :
//     reflet irisé, « Oh ! Elle est brillante ! », « Cette créature va vivre dans ton récif ! » (le récif vivant montre
//     toutes les zones, décision du parent du 5 octobre 2026) ; l'album les montre, et le récif aussi.
//  2. Le quota atteint : jamais de doublon ; un coquillage rend brillante une créature déjà possédée.
//  3. Une étoile dorée et le grand large complet (contenu fictif pour la capture) : le coquillage doré donne
//     une légendaire, sans dépenser d'étoiles de mer.
//  4. La surprise : la tortue qui traverse, le banc de poissons (plus de cadeau depuis le 5 octobre 2026).
//  5. L'espace parent : le bloc « Cartes ».
// Captures dans tests/e2e/out/cartes/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/cartes.mjs [--out dossier]
import { chromium, voixPermise } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/cartes")); mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const lagon = cartes.cartes.filter((c) => c.zone === "lagon").map((c) => c.id), corail = cartes.cartes.filter((c) => c.zone === "corail").map((c) => c.id);
const large = cartes.cartes.filter((c) => c.zone === "large" && c.rarete !== "legendaire").map((c) => c.id);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const Q = "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=2&guides=0";

// une page neuve, un état du trésor posé dans la base, puis rechargée
async function fresh(state, q = Q, dpr = 1) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (st) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); for (const r of st) await s.put("recompenses", r); }, state);
  await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined);
  // ce que la voix dit, pour les vérifications
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { context, page };
}
const owned = (ids, extra = {}) => ({ id: "cartes", cartes: Object.fromEntries(ids.map((id) => [id, { n: 1, premiere: 1, brillante: false, ...extra }])) });
const said = (page) => page.evaluate(() => window.__said.join(" | "));
// joue la séance jusqu'à la récompense ; `atShell(n)` est appelé à chaque coquillage (avant de le toucher)
async function playToReward(page, { onCeremony, atShell, atCard } = {}) {
  await page.tap(".play", { force: true });
  let shells = 0, cards = 0, cer = false;
  for (const until = Date.now() + 150000; Date.now() < until;) {
    const st = await page.evaluate(() => { const s = window.__app.screen; return { q: s?.q && !s.locked && s.resolve ? s.q.answer : null, f: s?.q?.format, shell: !!document.querySelector(".shelltap"), check: !!document.querySelector(".check"), zone: !!document.querySelector(".card.zone-closed"), card: !!document.querySelector(".card.flipped"), moon: !!document.querySelector(".moon") }; });
    if (st.moon) return;
    if (st.zone && !cer) { cer = true; await onCeremony?.(); continue; }
    if (st.q !== null) { if (st.f === "lire" || st.f === "sauter") await page.tap(`.answer[data-value="${st.q}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); await page.waitForTimeout(200); continue; }
    if (st.shell) { await atShell?.(++shells); await page.tap(".shelltap", { force: true }); await page.waitForTimeout(300); continue; }
    if (st.card && st.check) { await page.waitForTimeout(1300); await atCard?.(++cards); await page.tap(".check", { force: true }); await page.waitForTimeout(800); continue; }
    await page.waitForTimeout(150);
  }
  throw new Error("la séance ne s'est pas terminée");
}

// ---- 1. ouverture du récif de corail, cartes brillantes, album
{
  const { context, page } = await fresh([owned(lagon), { id: "quota", date: Date.now() - 3600000, cartes: 15 }, { id: "etoiles", total: 60, cumul: 60, arcEnCiel: 1, dorees: 0, coquillages: 15 }], Q, 2);
  await page.evaluate(() => { window.__app.rewards.c = { ...window.__app.rewards.c, brillanteNouvelle: 1 }; });
  await playToReward(page, {
    onCeremony: async () => { await page.waitForTimeout(1000); await page.screenshot({ path: join(OUT, "1-zone-fermee.png") }); await page.waitForFunction(() => !document.querySelector(".card.zone-closed"), null, { timeout: 20000 }); await page.waitForTimeout(700); await page.screenshot({ path: join(OUT, "2-zone-ouverte.png") }); },
    atShell: async (n) => { if (n === 1) await page.screenshot({ path: join(OUT, "3-coquillage.png") }); },
    atCard: async (n) => { if (n === 1) { await page.screenshot({ path: join(OUT, "4-carte-brillante.png") }); await page.waitForTimeout(1200); await page.screenshot({ path: join(OUT, "4b-carte-brillante-reflet.png") }); } },
  });
  const r = await page.evaluate(() => ({ zones: window.__app.rewards.zones.ouvertes, arc: window.__app.rewards.arcDispo, owned: window.__app.rewards.owned, misses: [...window.__app.voice.misses], rec: window.__app.session.rec }));
  const won = r.rec.cartes ?? [];
  check(r.zones.includes("corail"), "le récif de corail est ouvert");
  check(r.arc === 0, "l'étoile arc-en-ciel de la réserve a été dépensée");
  check(won.length >= 1 && won.every((id) => corail.includes(id)), `cartes gagnées dans le récif de corail : ${won.join(", ")}`);
  check(won.every((id) => r.owned[id].brillante), "tirage forcé : les cartes sortent brillantes");
  const s = await said(page);
  check(s.includes("Le récif de corail est ouvert !"), "la voix annonce l'ouverture de la zone");
  check(s.includes("Oh ! Elle est brillante !"), "la voix dit « Oh ! Elle est brillante ! »");
  check(s.includes("Cette créature va vivre dans ton récif !") && !s.includes("Tu la retrouveras dans ton album !"), "une carte du récif de corail vit dans le récif");
  check(r.misses.length === 0, `chaque phrase dite a son fichier son${r.misses.length ? ` ; sans fichier : ${r.misses.join(" | ")}` : ""}`);
  // le récif vivant : les créatures du récif de corail y sont, avec celles du lagon
  await page.tap(".reefkey", { force: true });
  const viv = await recifOuvert(page);
  // (quatre créatures portent un autre nom dans la maquette du récif vivant : session/reef.js, NOM_MAQUETTE)
  const MAQ = { "benitier-geant": "benitier", "meduse-criniere": "meduse", "ver-tubicole-geant": "ver-tubicole", "requin-groenland": "requin-du-groenland" };
  check(won.every((id) => viv.includes(MAQ[id] ?? id)) && viv.length === lagon.length + won.length, `récif : ${viv.length} créatures, dont celles du récif de corail`);
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);
  // l'album : la page du récif de corail, avec les vignettes brillantes
  await page.waitForSelector(".albumkey", { timeout: 20000 }); await page.tap(".albumkey", { force: true }); await page.waitForSelector(".album-card", { timeout: 10000 });
  await page.waitForTimeout(500);
  const tabs = await page.$$(".album-tab"); await tabs[1].tap({ force: true }); await page.waitForTimeout(1200);
  const shiny = await page.locator(".album-page .album-card.got.shiny").count();
  check(shiny === won.length, `album : ${shiny} vignette(s) brillante(s) dans le récif de corail`);
  check(await page.locator(".album-tab.closed").count() === 2, "album : deux zones encore fermées");
  await page.screenshot({ path: join(OUT, "5-album-corail.png") });
  await page.tap(".album-page .album-card.got", { force: true }); await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "6-carte-en-grand.png") });
  check(await page.locator(".card .shine canvas").count() === 1, "la carte en grand a son reflet irisé");
  // décision du parent du 28 septembre : la voix dit la carte une fois, à l'ouverture ; rien au retournement
  const saidN = () => page.evaluate(() => window.__app.voice.__said.length);
  await page.evaluate(() => { const v = window.__app.voice; v.__said = []; const say = v.say.bind(v); v.say = (t, o) => { v.__said.push(t); return say(t, o); }; });
  await page.tap(".card", { force: true }); await page.waitForTimeout(800); await page.tap(".card", { force: true }); await page.waitForTimeout(800);
  check((await saidN()) === 0 && (await page.locator(".card.flipped").count()) === 0, `album : la carte retournée deux fois, aucune phrase dite (${await saidN()})`);
  await context.close();
}

// ---- 2. le quota atteint : jamais de doublon, une créature possédée devient brillante
{
  const { context, page } = await fresh([owned(lagon.slice(0, 6)), { id: "quota", date: Date.now() - 3600000, cartes: 6 }, { id: "etoiles", total: 30, cumul: 30, arcEnCiel: 0, dorees: 0, coquillages: 6 }]);
  // quota : 6 + 2 = 8 ; on remplit les deux places
  await page.evaluate(async () => { const rw = window.__app.rewards; rw.owned = { ...rw.owned, [window.__app.cartes.cartes[6].id]: { n: 1, premiere: 1, brillante: false }, [window.__app.cartes.cartes[7].id]: { n: 1, premiere: 1, brillante: false } }; });
  await playToReward(page);
  const r = await page.evaluate(() => ({ n: Object.keys(window.__app.rewards.owned).length, quota: window.__app.rewards.quota(), rec: window.__app.session.rec, owned: window.__app.rewards.owned, misses: [...window.__app.voice.misses] }));
  const got = r.rec.cartes ?? [];
  check(r.n === 8 && r.n <= r.quota && got.length >= 1, `quota atteint (${r.n} / ${r.quota}) : ${got.length} coquillage(s), aucune carte nouvelle`);
  check(got.every((id) => r.owned[id].brillante && r.owned[id].n === 1) && new Set(got).size === got.length, `les créatures rendues brillantes : ${got.join(", ")} (aucun doublon)`);
  const s2 = await said(page);
  check(/Oh ! Elle est brillante !/.test(s2) && !/Tu avais déjà/.test(s2), "la voix dit « C'est … ! Oh ! Elle est brillante ! »");
  check(r.misses.length === 0, `chaque phrase dite a son fichier son${r.misses.length ? ` ; sans fichier : ${r.misses.join(" | ")}` : ""}`);
  await context.close();
}

// ---- 3. le coquillage doré (contenu du grand large fictif, pour la capture)
{
  const { context, page } = await fresh([owned([...lagon, ...corail, ...large]), { id: "zones", ouvertes: ["lagon", "corail", "large"], dates: {} }, { id: "quota", date: Date.now() - 3600000, cartes: lagon.length + corail.length + large.length }, { id: "etoiles", total: 0, cumul: 500, arcEnCiel: 3, arcDepensees: 2, dorees: 1, doreesDepensees: 0, coquillages: 43 }]);
  await page.route("**/fictive.webp", (r) => r.fulfill({ status: 200, contentType: "image/webp", body: "" })); // une image illisible : la carte montre son fond d'eau
  // (contenu fictif du grand large, pour la capture : ces phrases ne sont pas fabriquées)
  voixPermise(/^Anecdote fictive pour la capture\.$/, /^C.est le grand requin blanc !$/);
  await page.evaluate(() => { for (const c of window.__app.cartes.cartes) if (c.zone === "large") { c.anecdote ??= "Anecdote fictive pour la capture."; c.illustration ??= "assets/cards/fictive.webp"; } });
  let shot = false;
  await playToReward(page, { atShell: async () => { if (!shot) { shot = true; await page.screenshot({ path: join(OUT, "7-coquillage-dore.png") }); } }, atCard: async (n) => { if (n === 1) await page.screenshot({ path: join(OUT, "8-legendaire.png") }); } });
  const r = await page.evaluate(() => ({ rec: window.__app.session.rec, dispo: window.__app.rewards.doreesDispo, st: window.__app.rewards.st }));
  check(r.rec.coquillageDore === "grand-requin-blanc", "le coquillage doré donne le grand requin blanc");
  check(r.dispo === 0 && r.st.coquillagesDores === 1, "l'étoile dorée est dépensée");
  check((await said(page)).includes("C'est une carte légendaire !"), "la voix dit « C'est une carte légendaire ! »");
  await context.close();
}

// ---- 4. la surprise
{
  for (const who of ["tortue", "poissons"]) {
    const c = await fresh([], `${Q}&surprise=visite:${who}`);
    // (la phrase vient après le bonjour de la pieuvre, 2,5 à 3,5 s après le toucher : on l'attend, puis le visiteur traverse)
    await c.page.tap(".play", { force: true });
    await c.page.waitForFunction(() => window.__said.some((t) => t.includes("quelqu'un vient te dire bonjour")), null, { timeout: 15000 }).catch(() => {});
    await c.page.waitForTimeout(1500);
    await c.page.screenshot({ path: join(OUT, `11-visite-${who}.png`) });
    check((await said(c.page)).includes("Regarde, quelqu'un vient te dire bonjour !"), `visite (${who}) : la voix l'annonce`);
    await c.context.close();
  }
}

// ---- 5. l'espace parent : le bloc « Cartes »
{
  const { context, page } = await fresh([owned(lagon.slice(0, 9)), { id: "quota", date: Date.now() - 3600000, cartes: 8 }, { id: "etoiles", total: 12, cumul: 300, arcEnCiel: 2, dorees: 0, coquillages: 9 }]);
  await page.evaluate(async () => { const p = window.__app.parent; p.tab = "progression"; p.open(); await p.dashboard(); });
  await page.waitForTimeout(500);
  const box = page.locator(".pa-card-box", { has: page.locator("h2", { hasText: /^Cartes$/ }) });
  check(await box.count() === 1, "espace parent : le bloc « Cartes » est dans l'onglet Progression");
  await box.scrollIntoViewIfNeeded(); await box.screenshot({ path: join(OUT, "12-parent-cartes.png") });
  const t = await box.textContent();
  check(/9 \/ 60/.test(t) && /cartes nouvelles encore gagnables/.test(t), "le bloc donne les cartes gagnées et le quota");
  await context.close();
}

check(errors.length === 0, `aucune erreur dans la page${errors.length ? ` : ${errors.join(" | ")}` : ""}`);
await browser.close(); srv.close();
