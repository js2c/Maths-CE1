// LE RÉCIF VIVANT (docs/SPEC.md, section 10, « Le récif vivant ») dans Chromium, tablette tactile, à 1280 × 800 (densité 2)
// et 1920 × 1200 (densité 1). Gestes au doigt (événements tactiles de Chromium) :
//  1. Toute la collection (les 60 créatures, dix brillantes) : on entre par le lagon ; glisser fait défiler la mer ; une
//     capture par zone ; une brillante scintille ; un toucher bref ouvre sa carte ; doigt posé puis glissé : la créature
//     se déplace, et c'est oublié à la visite suivante ; ni la mascotte ni le compteur d'étoiles par-dessus la mer.
//  2. Deux zones ouvertes seulement : on peut glisser jusqu'aux abysses (la mer est là, sans créature).
//  3. Une collection vide : la mer seule, la voix dit « recifVide ».
//  4. La maison : l'accueil revient, ses boutons dessinés, le récif libéré (canvas retirés, lagon reparti).
//   node tests/e2e/recif-vivant.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert, toucherCreature } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/recif-vivant")), SEUL = opt("--seul", null);
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const textes = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const Q = "?nosw&voix=rapide&son=non";
const ZONES = [["lagon", 0, 2600], ["corail", 2600, 5900], ["large", 5900, 8400], ["abysses", 8400, 10874]];
const BRILLANTES = ["crabe", "poisson-clown", "hippocampe", "tortue-verte", "poisson-perroquet", "requin-baleine", "dauphin", "calmar-geant", "poisson-lanterne", "pieuvre-dumbo"];

// un geste au doigt sur le canvas du récif : posé en (x0, y0), tenu `tenir` ms, glissé jusqu'à (x1, y1) en `pas` étapes
async function geste(page, cdp, [x0, y0], [x1, y1], { tenir = 0, pas = 12 } = {}) {
  const pt = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(x0, y0) });
  if (tenir) await page.waitForTimeout(tenir);
  for (let i = 1; i <= pas; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x0 + ((x1 - x0) * i) / pas, y0 + ((y1 - y0) * i) / pas) }); await page.waitForTimeout(16); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}
const etat = (page) => page.evaluate(() => {
  const a = window.__app, r = a.reef;
  return { open: r.open, camX: r.api?.camX ?? null, viv: r.api?.vivantes() ?? [], canvas: document.querySelectorAll("canvas.recif-vivant").length, octo: a.ocean.mascotteVisible && getComputedStyle(document.querySelector("#mascotte")).visibility !== "hidden", etoiles: getComputedStyle(document.querySelector(".hud.stars") ?? document.body).visibility, lagonPause: !!a.lagon?.paused };
});
// la collection posée dans la base
const poser = (page, ids, zones) => page.evaluate(async ({ ids, zones, br }) => {
  const s = window.__app.store; await s.setSetting("mascotte", "Pili");
  await s.put("recompenses", { id: "cartes", cartes: Object.fromEntries(ids.map((id) => [id, { n: 1, premiere: 1, brillante: br.includes(id) }])) });
  await s.put("recompenses", { id: "zones", ouvertes: zones, dates: {} });
}, { ids, zones, br: BRILLANTES });

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]]) {
  if (SEUL && SEUL !== String(W)) continue;
  const out = join(OUT, String(W)); mkdirSync(out, { recursive: true });
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true });
  const page = await context.newPage(), errors = [], cdp = await context.newCDPSession(page);
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const shot = (n) => page.screenshot({ path: join(out, `${n}.png`) });
  const go = async () => { await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 }); };
  const entrer = async () => { await page.tap(".reefkey", { force: true }); return recifOuvert(page); };
  const box = async () => page.locator("canvas.recif-dessin").boundingBox();

  // ---- 1. toute la collection
  await go(); await poser(page, cartes.cartes.map((c) => c.id), ["lagon", "corail", "large", "abysses"]); await go();
  const viv = await entrer();
  let e = await etat(page);
  check(viv.length === 60, `${W} : les 60 créatures vivent dans le récif (${viv.length})`);
  check(e.camX === 0, `${W} : on entre par le lagon (camX ${e.camX})`);
  check(!e.octo && e.etoiles === "hidden" && e.lagonPause, `${W} : ni la mascotte ni le compteur d'étoiles ; le lagon du fond en pause`);
  await shot("1-entree-lagon");
  // glisser vers la droite de la mer : le doigt va de droite à gauche
  const b = await box();
  await geste(page, cdp, [b.x + b.width * 0.8, b.y + b.height * 0.25], [b.x + b.width * 0.2, b.y + b.height * 0.25]);
  await page.waitForTimeout(1200); e = await etat(page);
  check(e.camX > 300, `${W} : glisser au doigt fait défiler la mer (camX ${Math.round(e.camX)})`);
  for (const [z, x0, x1] of ZONES) {
    await page.evaluate((x) => { const a = window.__app.reef.api; a.camX = x - a.vue.viewW / 2; }, (x0 + x1) / 2);
    await page.waitForTimeout(1500); await shot(`2-zone-${z}`);
  }
  await page.evaluate(() => { window.__app.reef.api.camX = 1e9; }); await page.waitForTimeout(1200); await shot("2-zone-abysses-fin");
  e = await etat(page);
  check(Math.round(e.camX) === Math.round(10874 - (await page.evaluate(() => window.__app.reef.api.vue.viewW))), `${W} : on va jusqu'au bout des abysses (camX ${Math.round(e.camX)})`);
  // une brillante, en grand
  await toucherCreature(page, "crabe"); await page.waitForTimeout(400); await shot("3-brillante-scintille");
  await page.waitForSelector(".card.shiny", { timeout: 20000 }).then(() => check(true, `${W} : toucher une brillante ouvre sa carte brillante`), () => check(false, `${W} : toucher une brillante ouvre sa carte brillante`));
  await page.waitForTimeout(900); await shot("4-carte-brillante");
  await page.tap(".check", { force: true }); await page.waitForTimeout(700);
  // une créature du grand large, touchée
  await toucherCreature(page, "requin-baleine"); await page.waitForSelector(".card", { timeout: 20000 }).catch(() => {});
  check((await page.locator(".card").count()) === 1, `${W} : toucher une créature du grand large ouvre sa carte`);
  await page.tap(".check", { force: true }); await page.waitForTimeout(700);
  // déplacer une créature (l'oursin, qui ne se promène pas tout seul) : doigt posé (plus de 260 ms), puis glissé
  await page.evaluate(() => window.__app.reef.api.aller("oursin")); await page.waitForFunction(() => window.__app.reef.api.ou("oursin"), null, { timeout: 15000 }); await page.waitForTimeout(300);
  const p0 = await page.evaluate(() => window.__app.reef.api.ou("oursin")), bb = await box();
  await geste(page, cdp, [bb.x + p0.x, bb.y + p0.y - 12], [bb.x + p0.x + 180, bb.y + p0.y - 70], { tenir: 450, pas: 15 });
  await page.waitForTimeout(500);
  const p1 = await page.evaluate(() => window.__app.reef.api.ou("oursin"));
  check(p1 && Math.hypot(p1.x - p0.x, p1.y - p0.y) > 60 && (await page.locator(".card").count()) === 0, `${W} : doigt posé puis glissé : l'oursin se déplace (${Math.round(p1?.x - p0.x)}, ${Math.round(p1?.y - p0.y)}), sans ouvrir sa carte`);
  await shot("5-crabe-deplace");
  // la maison, puis une nouvelle visite : le déplacement est oublié
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(800);
  e = await etat(page);
  check(!e.open && e.canvas === 0 && e.octo && e.etoiles !== "hidden" && !e.lagonPause, `${W} : la maison : le récif libéré, la mascotte, le compteur et le lagon reviennent`);
  check(await page.evaluate(() => { const cs = [...document.querySelectorAll("button.bubble canvas")]; return cs.length >= 4 && cs.every((c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true; return false; }); }), `${W} : les boutons de l'accueil sont dessinés`);
  await shot("6-accueil-au-retour");
  await entrer(); await page.evaluate(() => window.__app.reef.api.aller("oursin")); await page.waitForFunction(() => window.__app.reef.api.ou("oursin"), null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(300);
  const p2 = await page.evaluate(() => window.__app.reef.api.ou("oursin"));
  check(p2 && Math.hypot(p2.x - p0.x, p2.y - p0.y) < 30, `${W} : à la visite suivante, l'oursin est revenu à sa place`);
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);

  // ---- 2. deux zones ouvertes : on glisse jusqu'aux abysses, la mer sans créatures
  const deux = cartes.cartes.filter((c) => ["lagon", "corail"].includes(c.zone)).map((c) => c.id);
  await poser(page, deux, ["lagon", "corail"]); await go();
  const v2 = await entrer();
  check(v2.length === deux.length, `${W} : lagon et corail possédés : ${v2.length} créatures`);
  await page.evaluate(() => { window.__app.reef.api.camX = 1e9; }); await page.waitForTimeout(1500); await shot("7-abysses-fermees");
  const vis = await page.evaluate((ids) => ids.filter((id) => window.__app.reef.api.ou(id)), v2);
  check(vis.length === 0, `${W} : au bout des abysses, la mer sans créature (${vis.join(", ")})`);
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);

  // ---- 3. une collection vide
  await poser(page, [], ["lagon"]); await go();
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  const v3 = await entrer(); await shot("8-recif-vide");
  check(v3.length === 0 && (await page.evaluate(() => window.__said)).includes(textes.recifVide), `${W} : collection vide : la mer seule, « ${textes.recifVide} »`);
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForTimeout(600);

  check(errors.length === 0, `${W} : aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
  await context.close();
}
writeFileSync(join(OUT, "resultat.json"), JSON.stringify({ date: new Date().toISOString(), echecs: fail }, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exitCode = fail.length ? 1 : 0;
