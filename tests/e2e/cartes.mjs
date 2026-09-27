// LES CARTES DU LOT 2 dans Chromium (tablette 1280 × 800, tactile), voix accélérée (docs/SPEC-LOT2.md, section 5).
//  1. Le lagon complet et une étoile arc-en-ciel en réserve : à la récompense, le récif de corail s'ouvre
//     (cérémonie), puis les coquillages donnent des cartes du récif de corail, brillantes (tirage forcé) :
//     reflet irisé, « Oh ! Elle est brillante ! », « Tu la retrouveras dans ton album ! » ; l'album les montre.
//  2. Le quota atteint : un coquillage donne un doublon (même si la zone est incomplète).
//  3. Une étoile dorée et le grand large complet (contenu fictif pour la capture) : le coquillage doré donne
//     une légendaire, sans dépenser d'étoiles de mer.
//  4. La surprise : un cadeau (puis dans le récif), la tortue qui traverse, le banc de poissons.
//  5. L'espace parent : le bloc « Cartes ».
// Captures dans tests/e2e/out/cartes/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/cartes.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

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
  await page.evaluate(() => { window.__app.rewards.c = { ...window.__app.rewards.c, brillanteHasard: 1 }; });
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
  check(s.includes("Tu la retrouveras dans ton album !") && !s.includes("va vivre dans ton récif"), "une carte du récif de corail vit dans l'album");
  check(r.misses.length === 0, `chaque phrase dite a son fichier son${r.misses.length ? ` ; sans fichier : ${r.misses.join(" | ")}` : ""}`);
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
  await context.close();
}

// ---- 2. le quota atteint : un doublon, même si la zone n'est pas complète
{
  const { context, page } = await fresh([owned(lagon.slice(0, 6)), { id: "quota", date: Date.now() - 3600000, cartes: 6 }, { id: "etoiles", total: 30, cumul: 30, arcEnCiel: 0, dorees: 0, coquillages: 6 }]);
  // quota : 6 + 2 = 8 ; on remplit les deux places
  await page.evaluate(async () => { const rw = window.__app.rewards; rw.owned = { ...rw.owned, [window.__app.cartes.cartes[6].id]: { n: 1, premiere: 1, brillante: false }, [window.__app.cartes.cartes[7].id]: { n: 1, premiere: 1, brillante: false } }; });
  await playToReward(page);
  const r = await page.evaluate(() => ({ n: Object.keys(window.__app.rewards.owned).length, quota: window.__app.rewards.quota(), rec: window.__app.session.rec }));
  check(r.n <= r.quota && (r.rec.cartes ?? []).length >= 1, `quota atteint (${r.n} / ${r.quota}) : ${(r.rec.cartes ?? []).length} coquillage(s), aucune carte nouvelle`);
  check((await said(page)).includes("Tu avais déjà cette carte."), "la voix annonce un doublon");
  await context.close();
}

// ---- 3. le coquillage doré (contenu du grand large fictif, pour la capture)
{
  const { context, page } = await fresh([owned([...lagon, ...corail, ...large]), { id: "zones", ouvertes: ["lagon", "corail", "large"], dates: {} }, { id: "quota", date: Date.now() - 3600000, cartes: lagon.length + corail.length + large.length }, { id: "etoiles", total: 0, cumul: 500, arcEnCiel: 3, arcDepensees: 2, dorees: 1, doreesDepensees: 0, coquillages: 43 }]);
  await page.route("**/fictive.webp", (r) => r.fulfill({ status: 200, contentType: "image/webp", body: "" })); // une image illisible : la carte montre son fond d'eau
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
  const { context, page } = await fresh([], `${Q}&surprise=cadeau:corail`);
  await page.tap(".play", { force: true });
  await page.waitForSelector(".gift", { timeout: 20000 }); await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "9-surprise-cadeau.png") });
  await page.waitForFunction(() => window.__app.rewards.gifts.includes("corail"), null, { timeout: 20000 });
  check((await said(page)).includes("Surprise ! Un cadeau pour ton récif."), "cadeau : la voix l'annonce");
  const rec = await page.evaluate(() => window.__app.session.rec.surprise);
  check(rec?.type === "cadeau" && rec.id === "corail", "la séance note sa surprise");
  await context.close();
  // le cadeau est dans le récif
  const b = await fresh([{ id: "cadeaux", ids: ["corail", "gorgone", "etoile", "coquille"] }, owned(lagon)]);
  await b.page.tap(".reefkey", { force: true }); await b.page.waitForTimeout(2500);
  await b.page.screenshot({ path: join(OUT, "10-recif-cadeaux.png") });
  check((await b.page.evaluate(() => window.__app.reef.gifts.length)) === 4, "récif : les 4 cadeaux sont posés");
  await b.context.close();
  for (const who of ["tortue", "poissons"]) {
    const c = await fresh([], `${Q}&surprise=visite:${who}`);
    await c.page.tap(".play", { force: true }); await c.page.waitForTimeout(2600);
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
