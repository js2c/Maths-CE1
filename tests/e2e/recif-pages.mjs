// LOT 3, ÉTAPE 5 : LE RÉCIF EN PAGES, UNE PAR ZONE (décision du parent du 28 septembre 2026 ; docs/SPEC.md, « Le récif »).
// Dans Chromium (1280 × 800, densité 2), voix accélérée.
//  1. Le contenu réel : seule la page du lagon ; pas de perles ; un glisser fait un léger rebond ; toucher une créature
//     ouvre sa carte, un glisser qui part d'elle ne l'ouvre pas.
//  2. Données de TEST (injectées par ce parcours seulement, jamais dans app/content) : le récif de corail, ouvert, peuplé de
//     créatures du lagon (même dessin, planche « recif-test » : une copie décodée à part, pour mesurer deux zones
//     chargées). Entrée sur la zone de la dernière carte gagnée ; glisser vers le lagon et retour (le décor et les
//     créatures suivent le doigt ; au relâcher, calage au-delà d'un tiers ou d'un geste rapide, sinon retour) ; rebond en
//     bout de liste ; toucher une créature pendant que la page se cale, puis après ; toucher une perle ; planches chargées
//     et libérées, mémoire décodée avec deux zones. Captures dans tests/e2e/out/recif-pages.
//   node tests/e2e/recif-pages.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/recif-pages"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const lagon = cartes.cartes.filter((c) => c.zone === "lagon"), corail = cartes.cartes.filter((c) => c.zone === "corail");
const TEST = corail.slice(0, 5).map((c, k) => ({ id: c.id, as: lagon[k].id, recif: lagon[k].recif }));

async function open({ testZone = false, owned = {}, zones = ["lagon"] } = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  if (testZone) {
    // la zone fictive : les cartes du récif de corail prennent la place et le dessin d'une créature du lagon
    await page.route("**/content/cartes.json", async (r) => { const c = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))); for (const t of TEST) Object.assign(c.cartes.find((x) => x.id === t.id), { recif: t.recif }); await r.fulfill({ contentType: "application/json", body: JSON.stringify(c) }); });
    await page.route("**/assets/art/atlas.json", async (r) => {
      const a = JSON.parse(readFileSync(new URL("../../app/assets/art/atlas.json", import.meta.url)));
      for (const k of Object.keys(a.sheets)) if (k.startsWith("recif@")) a.sheets[k.replace("recif@", "recif-test@")] = a.sheets[k];
      for (const t of TEST) a.sprites[`creature.${t.id}`] = { ...a.sprites[`creature.${t.as}`], sheet: "recif-test" };
      await r.fulfill({ contentType: "application/json", body: JSON.stringify(a) });
    });
  }
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ({ owned, zones }) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); await s.put("recompenses", { id: "cartes", cartes: owned }); await s.put("recompenses", { id: "zones", ouvertes: zones, dates: {} }); }, { owned, zones });
  await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
}
const reef = (page) => page.evaluate(() => { const r = window.__app.reef, sp = window.__app.sprites; return { pages: r.pages, zone: r.pages?.[r.idx], shift: Math.round(r.shift ?? 0), loaded: [...sp.pages.keys()].filter((k) => k.startsWith("recif")).sort(), pearls: document.querySelectorAll(".reef-pearl").length, sel: document.querySelector(".reef-pearl.sel")?.dataset.zone ?? null, card: !!document.querySelector(".card"), anim: !!r.anim }; });
const memRecif = (page) => page.evaluate(() => { const sp = window.__app.sprites; let px = 0; for (const [k, { pages }] of sp.pages) if (k.startsWith("recif")) for (const p of pages) px += p.width * p.height; return +(px * 4 / 1048576).toFixed(1); });
// un glisser au doigt (souris : événements « pointer ») : de x0 à x1 en `steps` pas, `ms` au total ; `hold` : ne relâche pas
async function drag(page, x0, x1, { y = 330, steps = 12, ms = 400, hold = false } = {}) {
  await page.mouse.move(x0, y); await page.mouse.down();
  for (let i = 1; i <= steps; i++) { await page.mouse.move(x0 + ((x1 - x0) * i) / steps, y); await page.waitForTimeout(ms / steps); }
  if (!hold) await page.mouse.up();
}
const hitOf = (page, id) => page.evaluate((id) => { const b = [...document.querySelectorAll(`.creature[data-id="${id}"]`)].find((e) => e.style.visibility !== "hidden"); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, id);
const closeCard = async (page) => { await page.tap(".card ~ .check, .bubble.check:not(.key)", { force: true }).catch(() => {}); await page.waitForTimeout(600); };

// ---------------------------------------------------------------- 1. le contenu réel : une seule page, le rebond
{
  const { page, context, errors } = await open({ owned: { crabe: { n: 1, premiere: Date.now() }, hippocampe: { n: 1, premiere: Date.now() } } });
  await page.tap(".reefkey", { force: true }); await page.waitForSelector(".creature", { timeout: 20000 }); await page.waitForTimeout(800);
  let r = await reef(page);
  check(r.pages.join() === "lagon" && r.pearls === 0, `aujourd'hui : une seule page, le lagon, sans perles (${r.pages})`);
  await drag(page, 800, 300, { hold: true }); r = await reef(page);
  check(r.shift < 0 && r.shift >= -110, `glisser en bout de liste : une résistance (décalage ${r.shift} px pour 500 px de doigt)`);
  await page.screenshot({ path: join(OUT, "1-lagon-rebond.png") });
  await page.mouse.up(); await page.waitForTimeout(700); r = await reef(page);
  check(r.shift === 0 && r.zone === "lagon", "au relâcher : le rebond, retour sur le lagon");
  const c = await hitOf(page, "crabe");
  await drag(page, c[0], c[0] - 200, { y: c[1] }); await page.waitForTimeout(700);
  check(!(await reef(page)).card, "un glisser qui part d'une créature n'ouvre pas sa carte");
  await page.mouse.click(...(await hitOf(page, "crabe"))); await page.waitForTimeout(900);
  check((await reef(page)).card, "un toucher bref sur une créature ouvre sa carte");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- 2. deux zones (données de test)
{
  const now = Date.now(), owned = { crabe: { n: 1, premiere: now - 5000 }, "poisson-clown": { n: 1, premiere: now - 4000 }, hippocampe: { n: 1, premiere: now - 3000 } };
  TEST.slice(0, 3).forEach((t, i) => { owned[t.id] = { n: 1, premiere: now - 2000 + i * 100 }; });
  const { page, context, errors } = await open({ testZone: true, owned, zones: ["lagon", "corail"] });
  await page.tap(".reefkey", { force: true }); await page.waitForSelector(".creature", { timeout: 20000 }); await page.waitForTimeout(1200);
  let r = await reef(page);
  check(r.pages.join() === "lagon,corail" && r.zone === "corail", `entrée sur la zone de la dernière carte gagnée (${r.zone}), pages : ${r.pages}`);
  check(r.pearls === 2 && r.sel === "corail", `deux perles, celle du récif de corail allumée (${r.pearls}, ${r.sel})`);
  check(r.loaded.join() === "recif-test", `seule la planche de la page affichée est chargée (${r.loaded})`);
  await page.screenshot({ path: join(OUT, "2-corail-entree.png") });
  // glisser vers le lagon (à droite) : la planche voisine se charge dès le début du glisser
  await drag(page, 300, 560, { hold: true, ms: 500 }); await page.waitForTimeout(600); r = await reef(page);
  const two = await memRecif(page);
  check(r.shift > 200 && r.loaded.join() === "recif,recif-test", `le décor et les créatures suivent le doigt (${r.shift} px) ; la planche voisine chargée (${r.loaded})`);
  console.log(`     mémoire décodée, deux zones chargées (densité 2) : ${two} Mo`);
  await page.screenshot({ path: join(OUT, "3-glisser-vers-le-lagon.png") });
  await page.mouse.up(); await page.waitForTimeout(800); r = await reef(page);
  check(r.zone === "lagon" && r.shift === 0 && r.sel === "lagon", "au-delà d'un tiers de l'écran : la page se cale sur le lagon");
  check(r.loaded.join() === "recif", `la planche de l'autre zone est libérée (${r.loaded}) ; une zone : ${await memRecif(page)} Mo`);
  await page.screenshot({ path: join(OUT, "4-lagon.png") });
  // en deçà d'un tiers, lentement : retour
  await drag(page, 900, 700, { ms: 900 }); await page.waitForTimeout(800); r = await reef(page);
  check(r.zone === "lagon" && r.shift === 0, "un glisser court et lent : retour sur la même page");
  // en bout de liste (le lagon est la première page) : rebond
  await drag(page, 300, 900, { hold: true }); r = await reef(page);
  check(r.shift > 0 && r.shift <= 110, `avant le lagon : résistance (${r.shift} px)`);
  await page.mouse.up(); await page.waitForTimeout(800); r = await reef(page);
  check(r.zone === "lagon" && r.shift === 0, "rebond, puis retour sur le lagon");
  // un geste rapide et court suffit ; toucher une créature pendant que la page se cale
  await drag(page, 900, 760, { steps: 4, ms: 80 });
  await page.waitForTimeout(60); r = await reef(page);
  const moving = r.anim;
  const hit = await hitOf(page, TEST[0].id);
  if (hit) await page.mouse.click(...hit);
  await page.waitForTimeout(900); r = await reef(page);
  check(moving && r.zone === "corail", `un geste rapide et court : la page suivante (${r.zone})`);
  check(!!hit && r.card, "toucher une créature pendant que la page se cale ouvre sa carte");
  await page.screenshot({ path: join(OUT, "5-carte-pendant-le-calage.png") });
  await closeCard(page);
  check(!(await reef(page)).card, "la carte se range");
  // après le glisser : toucher une créature
  await page.mouse.click(...(await hitOf(page, TEST[1].id))); await page.waitForTimeout(900);
  check((await reef(page)).card, "après le glisser, toucher une créature ouvre sa carte"); await closeCard(page);
  // toucher une perle mène à sa zone
  await page.tap('.reef-pearl[data-zone="lagon"]', { force: true }); await page.waitForTimeout(900); r = await reef(page);
  check(r.zone === "lagon" && r.sel === "lagon" && r.loaded.join() === "recif", `toucher la perle du lagon y mène (${r.zone}, ${r.loaded})`);
  await page.screenshot({ path: join(OUT, "6-perle-lagon.png") });
  // sortie : tout est libéré, le décor remis en place
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(800);
  const end = await page.evaluate(() => ({ loaded: [...window.__app.sprites.pages.keys()].filter((k) => k.startsWith("recif")), bg: window.__app.stage.bg.style.transform, back: window.__app.ocean.backEl.style.transform, creatures: document.querySelectorAll(".creature").length, copies: document.querySelectorAll(".reef-bgcopy").length }));
  check(!end.loaded.length && !end.bg && !end.back && !end.creatures && !end.copies, `en quittant le récif : planches libérées, décor remis en place (${JSON.stringify(end)})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
