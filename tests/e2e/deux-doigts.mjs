// DEUX DOIGTS POSÉS SUR LA LIGNE GRADUÉE (lot « Recette de l'enfant et nettoyage des couches », premier passage de l'agent
// qui joue l'enfant, constat 5) : sur « Place le poisson sur le nombre … », deux doigts posés ensemble sur la ligne (une main
// qui s'appuie) donnaient une réponse, fausse, et la question était perdue. Désormais le geste est annulé : aucune réponse,
// le poisson revient l'attendre ; un seul doigt ensuite répond comme avant.
//   node tests/e2e/deux-doigts.mjs
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
const page = await context.newPage(), cdp = await context.newCDPSession(page), errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&choix=1:2&format=placer&sans=echauffement&sansLecon&guides=0"); await page.waitForFunction(() => window.__ready !== undefined);
await page.locator(".play").first().tap({ force: true });
const prete = () => page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.input && !s.locked; }, null, { timeout: 60000 });
await prete(); await page.waitForTimeout(900);
const reponses = () => page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 1).length);
const avant = await reponses(), y = await page.evaluate(() => { const b = window.__app.screen.band.getBoundingClientRect(); return b.y + b.height / 2; });
// deux doigts posés ensemble, puis levés l'un après l'autre
await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 500, y, id: 1 }, { x: 900, y, id: 2 }] });
await page.waitForTimeout(300);
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [{ x: 900, y, id: 2 }] });
await page.waitForTimeout(100);
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
await page.waitForTimeout(1200);
check(await reponses() === avant, "deux doigts posés ensemble sur la ligne : aucune réponse");
check(await page.evaluate(() => { const s = window.__app.screen; return !!(s.q && s.input && !s.locked && s.aimed == null); }), "la question attend toujours, le poisson n'est posé nulle part");
// un seul doigt, sur la bonne graduation : la réponse part, juste
const x = await page.evaluate(() => { const s = window.__app.screen, r = s.band.getBoundingClientRect(), k = r.width / s.band.offsetWidth; return r.left + (s.xOf(s.q.answer) - s.band.offsetLeft) * k; });
await page.touchscreen.tap(x, y);
// (la réponse est enregistrée après le « bravo » et son animation)
for (let i = 0; i < 75 && (await reponses()) === avant; i++) await page.waitForTimeout(200);
const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 1).at(-1));
check(await reponses() === avant + 1 && rep?.juste, `un seul doigt ensuite répond, comme avant (juste : ${rep?.juste})`);
check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
