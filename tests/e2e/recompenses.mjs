// LES RÉCOMPENSES ET LE RÉCIF dans Chromium (tablette 1280 × 800, tactile), voix accélérée.
//  1. Une séance courte avec un trésor de départ de 75 étoiles : à la récompense, un coquillage (40
//     étoiles) s'ouvre quand on le touche ; la carte sort, se retourne ; puis « à demain » et le récif.
//  2. Le récif : la créature obtenue y est ; la toucher montre sa carte, toucher la carte la retourne
//     (anecdote), la coche la range, la maison ramène à la lune.
//  3. Un récif complet (les 15 cartes, dont une brillante) pour les captures.
// Vérifie la base (étoiles dépensées, carte rangée, coquillage compté) et l'absence d'erreur.
//   node tests/e2e/recompenses.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/recompenses"));
mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const voixOk = async (quand) => { const m = await page.evaluate(() => [...window.__app.voice.misses]); check(m.length === 0, `${quand} : chaque phrase dite a son fichier son${m.length ? ` ; sans fichier : ${m.join(" | ")}` : ""}`); };

// ---- 1. une séance courte, puis le coquillage
// la série en est à 2 séances (hier) : celle-ci est la 3e, elle rapporte 5 étoiles ; cinq bonnes réponses
// rapides au niveau 1 font franchir un niveau (voie rapide) : une étoile arc-en-ciel
const Q = `?nosw&voix=rapide&etoiles=75&sansLecon&sans=echauffement&questions=5&guides=0`;
await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(() => window.__app.store.put("recompenses", { id: "serie", seances: 2, derniere: Date.now() - 86400000 }));
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
check((await page.locator(".reefkey").count()) === 1, "écran de départ : la bulle du récif à côté de « jouer »");
await page.tap(".play", { force: true });
await page.waitForSelector(".name", { timeout: 20000 }); await page.tap('.name[data-value="Bulle"]', { force: true }); await page.waitForTimeout(300); await page.tap(".check", { force: true });
for (const until = Date.now() + 120000; Date.now() < until;) {
  const st = await page.evaluate(() => { const s = window.__app.screen; return { end: !!document.querySelector(".tally"), q: s?.q && !s.locked && s.resolve ? s.q.answer : null }; });
  if (st.end) break;
  if (st.q === null) { await page.waitForTimeout(150); continue; }
  const fmt = await page.evaluate(() => window.__app.screen.q.format);
  if (fmt === "lire" || fmt === "sauter") await page.tap(`.answer[data-value="${st.q}"]`, { force: true });
  else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
  await page.waitForFunction(() => !window.__app.screen?.resolve || window.__app.screen.locked, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(250);
}
await page.waitForSelector(".special", { timeout: 60000 }); await page.waitForTimeout(700);
await shot("0-etoile-arc-en-ciel");
await page.waitForSelector(".shelltap", { timeout: 60000 }); await page.waitForTimeout(1500);
await shot("1-coquillage");
const spent = await page.evaluate(() => [window.__app.hud.shown, window.__app.rewards.total, window.__app.session.rec.etoiles]);
check(spent[0] === spent[1] && spent[1] === 75 + spent[2] - 40, `les 40 étoiles du coquillage quittent le compteur (${spent[0]})`);
await page.tap(".shelltap", { force: true });
await page.waitForTimeout(1300); await shot("2-perle");
await page.waitForSelector(".card", { timeout: 20000 }); await page.waitForTimeout(700); await shot("3-carte-dos");
await page.waitForSelector(".card.flipped", { timeout: 20000 }); await page.waitForTimeout(1000); await shot("4-carte");
await page.waitForSelector(".check", { timeout: 60000 }); await page.tap(".check", { force: true });
// un deuxième coquillage si le trésor le permet encore
if (await page.waitForSelector(".shelltap", { timeout: 4000 }).catch(() => null)) { await page.tap(".shelltap", { force: true }); await page.waitForSelector(".card.flipped", { timeout: 20000 }); await page.waitForSelector(".check", { timeout: 60000 }); await page.tap(".check", { force: true }); }
await page.waitForSelector(".moon", { timeout: 60000 }); await page.waitForTimeout(800);
await shot("5-a-demain");
const db = await page.evaluate(async () => { const s = window.__app.store; return { etoiles: await s.get("recompenses", "etoiles"), cartes: await s.get("recompenses", "cartes"), serie: await s.get("recompenses", "serie"), seance: (await s.all("seances")).at(-1) }; });
const owned = Object.keys(db.cartes?.cartes ?? {});
check(owned.length >= 1 && owned.length === db.etoiles.coquillages, `${owned.length} carte(s) rangée(s) dans la collection (${owned.join(", ")})`);
check(db.etoiles.total === 75 + db.seance.etoiles - 40 * db.etoiles.coquillages && db.etoiles.total < 40, `étoiles : 75 + ${db.seance.etoiles} gagnées − ${40 * db.etoiles.coquillages} dépensées = ${db.etoiles.total}`);
check(db.seance.cartes?.length === db.etoiles.coquillages && db.serie?.seances === 3, "la séance note ses cartes ; la série compte trois séances");
check(db.seance.arcEnCiel >= 1 && db.etoiles.arcEnCiel === db.seance.arcEnCiel, `niveau franchi : ${db.etoiles.arcEnCiel} étoile(s) arc-en-ciel`);
check(db.seance.etoiles >= 5 + 5 + 10, `la 3e séance de la série rapporte 5 étoiles de plus (${db.seance.etoiles} gagnées)`);
check((await page.evaluate(() => window.__app.hud.shown)) === db.etoiles.total, "le compteur montre le trésor restant");
check(!(await page.evaluate(() => window.__app.sprites.ready("cartes"))), "la planche des cartes est libérée après la récompense");

// ---- 2. le récif
await page.tap(".reefkey", { force: true });
await page.waitForSelector(".creature", { timeout: 20000 }); await page.waitForTimeout(1200);
await shot("6-recif");
check((await page.locator(".creature").count()) === owned.length, "chaque carte a sa créature dans le récif");
await page.tap(`.creature[data-id="${owned[0]}"]`, { force: true });
await page.waitForSelector(".card", { timeout: 20000 }); await page.waitForTimeout(900); await shot("7-recif-carte");
await page.tap(".card", { force: true }); await page.waitForTimeout(1000); await shot("8-recif-anecdote");
check(await page.locator(".card.flipped").count() === 1, "toucher la carte la retourne (anecdote)");
await page.tap(".check", { force: true }); await page.waitForTimeout(600);
check(await page.locator(".card").count() === 0, "la coche range la carte");
await page.tap(".homekey", { force: true }); await page.waitForTimeout(600);
check((await page.locator(".moon").count()) === 1 && (await page.locator(".creature").count()) === 0 && !(await page.evaluate(() => window.__app.sprites.ready("recif"))), "la maison ramène à la lune ; le récif est libéré");

await voixOk("séance et récompense");

// ---- 3. un récif complet
await page.evaluate(async (ids) => { const o = {}; ids.forEach((id, i) => { o[id] = { n: id === "hippocampe" ? 4 : 1, premiere: Date.now(), brillante: id === "hippocampe" }; }); await window.__app.store.put("recompenses", { id: "cartes", cartes: o }); }, cartes.cartes.map((c) => c.id));
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(500);
await page.tap(".reefkey", { force: true }); await page.waitForSelector(".creature", { timeout: 20000 }); await page.waitForTimeout(1500);
await shot("9-recif-complet");
check((await page.locator(".creature").count()) === 15, "récif complet : 15 créatures");
await page.tap('.creature[data-id="hippocampe"]', { force: true }); await page.waitForSelector(".card.shiny", { timeout: 20000 }); await page.waitForTimeout(1000);
await shot("10-carte-brillante");
await voixOk("récif complet");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
