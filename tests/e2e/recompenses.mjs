// LES RÉCOMPENSES ET LE RÉCIF dans Chromium (tablette 1280 × 800, tactile), voix accélérée.
//  1. Une séance courte avec un trésor de départ de 75 étoiles : à la récompense, un coquillage (son prix,
//     cartes.json) s'ouvre quand on le touche ; la carte sort, se retourne ; puis « à demain » et le récif.
//  2. Le récif : la créature obtenue y est ; la toucher montre sa carte, toucher la carte la retourne
//     (anecdote), la coche la range, la maison ramène à la lune.
//  3. Un récif complet (les 15 cartes, dont une brillante) pour les captures.
//  4. L'album (lot 1 bis) : depuis l'accueil et depuis le récif ; cartes obtenues, dos des cartes à
//     découvrir, zones fermées, perles.
// Vérifie la base (étoiles dépensées, carte rangée, coquillage compté) et l'absence d'erreur.
//   node tests/e2e/recompenses.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert, toucherCreature } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/recompenses"));
mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))), PRIX = cartes.coquillage.prix;
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
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
check(spent[0] === spent[1] && spent[1] === 75 + spent[2] - PRIX, `les ${PRIX} étoiles du coquillage quittent le compteur (${spent[0]})`);
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
check(db.etoiles.total === 75 + db.seance.etoiles - PRIX * db.etoiles.coquillages && (db.etoiles.total < PRIX || db.etoiles.coquillages === cartes.coquillage.parSeance), `étoiles : 75 + ${db.seance.etoiles} gagnées − ${PRIX * db.etoiles.coquillages} dépensées = ${db.etoiles.total}`);
check(db.seance.cartes?.length === db.etoiles.coquillages && db.serie?.seances === 3, "la séance note ses cartes ; la série compte trois séances");
check(db.seance.arcEnCiel >= 1 && db.etoiles.arcEnCiel === db.seance.arcEnCiel, `niveau franchi : ${db.etoiles.arcEnCiel} étoile(s) arc-en-ciel`);
check(db.seance.etoiles >= 5 + 5 + 10, `la 3e séance de la série rapporte 5 étoiles de plus (${db.seance.etoiles} gagnées)`);
check((await page.evaluate(() => window.__app.hud.shown)) === db.etoiles.total, "le compteur montre le trésor restant");
check(!(await page.evaluate(() => window.__app.sprites.ready("cartes"))), "la planche des cartes est libérée après la récompense");

// ---- 2. le récif
// (décision du parent du 28 septembre) les phrases dites : aucune au retournement d'une carte en grand
const saidN = () => page.evaluate(() => { const v = window.__app.voice; if (!v.__said) { v.__said = []; const say = v.say.bind(v); v.say = (t, o) => { v.__said.push(t); return say(t, o); }; } return v.__said.length; });
await page.tap(".reefkey", { force: true });
let vivantes = await recifOuvert(page);
await shot("6-recif");
check(vivantes.length === owned.length, `chaque carte a sa créature dans le récif (${vivantes.join(", ")})`);
await toucherCreature(page, owned[0]);
await page.waitForSelector(".card", { timeout: 20000 }); await page.waitForTimeout(900); await shot("7-recif-carte");
let n0 = await saidN();
await page.tap(".card", { force: true }); await page.waitForTimeout(1000); await shot("8-recif-anecdote");
check(await page.locator(".card.flipped").count() === 1, "toucher la carte la retourne (anecdote)");
await page.tap(".card", { force: true }); await page.waitForTimeout(700);
check(await page.locator(".card.flipped").count() === 0 && (await saidN()) === n0, `récif : retourner la carte dans les deux sens ne relance pas la voix (${(await saidN()) - n0} phrase(s))`);
await page.tap(".check", { force: true }); await page.waitForTimeout(600);
check(await page.locator(".card").count() === 0, "la coche range la carte");
await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);
check((await page.locator(".moon").count()) === 1 && (await page.locator("canvas.recif-vivant").count()) === 0 && !(await page.evaluate(() => window.__app.reef.open)), "la maison ramène à la lune ; le récif est libéré");
// (correctif du 5 octobre) chaque bouton de l'accueil a des pixels peints, pas seulement une place
check(await page.evaluate(() => { const cs = [...document.querySelectorAll("button.bubble canvas")]; return cs.length > 0 && !document.querySelector("#ui.ui-recif") && cs.every((c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true; return false; }); }), "les boutons de l'accueil sont dessinés au retour du récif");

await voixOk("séance et récompense");

// ---- 3. un récif complet
await page.evaluate(async (ids) => { const o = {}; ids.forEach((id, i) => { o[id] = { n: id === "hippocampe" ? 4 : 1, premiere: Date.now(), brillante: id === "hippocampe" }; }); await window.__app.store.put("recompenses", { id: "cartes", cartes: o }); }, cartes.cartes.filter((c) => c.zone === "lagon").map((c) => c.id));
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(500);
await page.tap(".reefkey", { force: true }); vivantes = await recifOuvert(page);
await shot("9-recif-complet");
check(vivantes.length === 15, "récif complet : 15 créatures");
await toucherCreature(page, "hippocampe"); await page.waitForSelector(".card.shiny", { timeout: 20000 }); await page.waitForTimeout(1000);
await shot("10-carte-brillante");
await voixOk("récif complet");
await page.tap(".check", { force: true }); await page.waitForTimeout(600);

// ---- 4. l'album, depuis le récif puis depuis l'accueil
await page.tap(".albumkey", { force: true }); await page.waitForSelector(".album-card.got", { timeout: 20000 }); await page.waitForTimeout(1200);
await shot("11-album-depuis-le-recif");
check((await page.locator(".album-page .album-card").count()) === 15 && (await page.locator(".album-card.got").count()) === 15, "album : le lagon complet, 15 cartes visibles");
await page.tap(".album-card.got >> nth=2", { force: true }); await page.waitForSelector(".card", { timeout: 20000 }); await page.waitForTimeout(900);
await shot("12-album-carte");
n0 = await saidN();
await page.tap(".card", { force: true }); await page.waitForTimeout(1000); await shot("13-album-verso");
check((await saidN()) === n0, "album : retourner la carte ne relance pas la voix");
await page.tap(".check", { force: true }); await page.waitForTimeout(600);
await page.tap(".album-tab >> nth=2", { force: true }); await page.waitForTimeout(1200);
await shot("14-album-zone-fermee");
check((await page.locator(".album-page .album-card.closed").count()) === 15, "album : le grand large, fermé, montre 15 dos assombris");
await page.tap(".homekey:not(.session-home) >> nth=-1", { force: true }); await page.waitForTimeout(600);
check((await page.locator(".album-page").count()) === 0 && (await page.evaluate(() => window.__app.reef.open && window.__app.reef.api.vivantes().length)) === 15, "la maison de l'album ramène au récif");
await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);
// l'album depuis l'accueil, avec quelques cartes seulement : des dos à découvrir
await page.evaluate(async () => { await window.__app.store.put("recompenses", { id: "cartes", cartes: { crabe: { n: 1, premiere: Date.now() }, hippocampe: { n: 1, premiere: Date.now() }, "poisson-clown": { n: 1, premiere: Date.now() } } }); });
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(500);
await page.tap(".albumkey", { force: true }); await page.waitForSelector(".album-card.back", { timeout: 20000 }); await page.waitForTimeout(1200);
await shot("15-album-a-decouvrir");
check((await page.locator(".album-page .album-card.got").count()) === 3 && (await page.locator(".album-page .album-card.back").count()) === 12, "album : 3 cartes obtenues, 12 dos à découvrir");
await page.tap(".album-card.back >> nth=0", { force: true }); await page.waitForTimeout(400);
check((await page.evaluate(() => window.__app.voice.instruction)) === cartes.zones[0].dosLu, "toucher un dos : « Cette carte t'attend quelque part dans le lagon ! »");
await page.tap(".album-tab >> nth=3", { force: true }); await page.waitForTimeout(1200);
await shot("16-album-abysses");
check((await page.evaluate(() => window.__app.voice.instruction)) === cartes.zones[3].fermeeLu, "toucher une zone fermée : elle s'ouvrira grâce aux étoiles arc-en-ciel");
await voixOk("album");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
