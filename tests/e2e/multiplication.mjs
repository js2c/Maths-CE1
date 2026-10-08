// LOT « MULTIPLICATION » (docs/LOTS.md, fiche 5 ; docs/maquettes/multiplication/PROPOSITION.md ; docs/SPEC.md, section 7 ter) :
// le parcours de chaque situation nouvelle, en 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures dans
// tests/e2e/out/multiplication :
//  1. « choisir » : cinq exercices, la multiplication ; ses 9 niveaux, l'appui long sur la tuile 6, la légende ;
//  2. le niveau 1 choisi (cran conseillé) : la leçon d'entrée L13 (les rangées comptées), l'exemple guidé, une question
//     (« 4 + 4 + 4 », les rangées au-dessus du pavé), une bonne réponse, une erreur M1 (a additionné) et sa correction ;
//  3. le niveau 3 (la table de 2) : la question sans image, le coquillage (les rangées comptées, l'astuce « le double »),
//     « je ne sais pas » ;
//  4. le niveau 6 (le tour) : la plaque « 3 × 5 = 15 » et la question « 5 × 3 » ;
//  5. le cran « très dur » au niveau 9 : les formes à trou (« 3 × ? = 12 », « ? × 4 = 12 ») ; le cran « plus facile » au
//     niveau 7 : les rangées comptées d'emblée ;
//  6. le menu des leçons (quatre rangées, les deux tables), la leçon L14 jusqu'au bout, « À toi ! » : le niveau 6 ;
//  7. la table de multiplication : la consigne, une case (« 3 fois 4, 12. »), 10 × 10 ;
//  8. l'espace parent : le bloc de la multiplication, le point de départ.
//   node tests/e2e/multiplication.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(opt("--out", "tests/e2e/out/multiplication")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const journal = [];

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]].filter(([w]) => !SEUL || String(w) === SEUL)) {
  const T = `${W}`, big = W === 1280;
  const open = async (q = "", prep = null) => {
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
    if (prep) await page.evaluate(`(${prep})()`);
    await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
    return { page, context, errors };
  };
  const shot = (page, n) => page.screenshot({ path: join(OUT, `${T}-${n}.png`) });
  const tap = async (page, sel, wait = 250) => { await page.tap(sel, { force: true }); await page.waitForTimeout(wait); };
  const said = (page) => page.evaluate(() => window.__said.join(" | "));
  const resetSaid = (page) => page.evaluate(() => { window.__said = []; });
  const note = async (page, quoi) => { if (big) journal.push({ quoi, dit: await page.evaluate(() => [...window.__said]) }); };
  const visible = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden" && !e.closest(".stash")).length, sel);
  const bulle = (page) => page.evaluate(() => window.__app.bulle.etat());
  const qOpen = (page, t = 60000) => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: t, polling: 100 });
  const typeIn = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(160); } await page.tap('.key[data-key="valider"]', { force: true }); };
  const q = (page) => page.evaluate(() => { const f = window.__app.facts.q; return { a: f.a, b: f.b, n: f.n, module: f.module, niveau: f.niveau, forme: f.forme ?? "directe", image: f.image, guide: !!f.guide, tour: f.tour ?? null, addition: !!f.addition, attendu: f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a * f.b }; });
  const slate = (page) => page.evaluate(() => window.__app.facts.slate.textContent || window.__app.facts.slate.getAttribute("aria-label") || "");
  const cdps = new WeakMap(), cdpOf = async (page) => { if (!cdps.has(page)) cdps.set(page, await page.context().newCDPSession(page)); return cdps.get(page); };
  const hold = async (page, sel, ms = 800) => {
    const r = await page.locator(sel).first().boundingBox(), cdp = await cdpOf(page), x = r.x + r.width / 2, y = r.y + r.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await page.waitForTimeout(ms);
    const label = await page.evaluate(() => document.querySelector(".etiquette:not([data-sortie])")?.dataset.pour ?? null);
    return { label, release: async () => { await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(600); } };
  };
  // ce qui est dessiné sur le calque des aides (les rangées) : son cadre, en coordonnées de la scène
  const board = (page) => page.evaluate(() => { const c = document.querySelector("canvas.aid-board"); if (!c?.width) return null; const x = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let y0 = 1e9, y1 = -1, x0 = 1e9, x1 = -1; for (let y = 0; y < c.height; y += 4) for (let i = 0; i < c.width; i += 4) if (x[(y * c.width + i) * 4 + 3]) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); x0 = Math.min(x0, i); x1 = Math.max(x1, i); } const k = c.width / 1280; return y1 < 0 ? null : [x0 / k, y0 / k, x1 / k, y1 / k].map(Math.round); });
  // les rangées ne touchent ni l'ardoise (jusqu'à y 332) ni les bords de la scène
  const rowsOk = (r) => r && r[1] >= 330 && r[3] <= 800 && r[0] >= 0 && r[2] <= 1280;
  const nsp = (page) => page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); });

  // 1. « choisir » : cinq exercices, la multiplication et ses 9 niveaux
  {
    const { page, context, errors } = await open();
    await tap(page, ".choisir", 900); await page.waitForSelector('[data-key="multiplication"]', { timeout: 15000 }); await page.waitForTimeout(500);
    const ex = await page.evaluate(() => [...document.querySelectorAll("[data-key]")].filter((e) => e.isConnected && !/^\d+$/.test(e.dataset.key) && getComputedStyle(e).visibility !== "hidden").map((e) => e.dataset.key));
    check(["ligne", "additions", "calcul", "voiliers", "multiplication"].every((k) => ex.includes(k)), `${T} · « choisir » : cinq exercices (${ex.join(",")})`);
    const r0 = await page.evaluate(() => ["ligne", "additions", "calcul", "voiliers", "multiplication"].map((k) => document.querySelector(`[data-key="${k}"]`).getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    check(r0.every((b) => b[0] >= 0 && b[2] <= W && b[3] <= H) && r0.every((b, i) => i === 0 || (b[0] + b[2]) / 2 - (r0[i - 1][0] + r0[i - 1][2]) / 2 >= (160 * W) / 1280), `${T} · les cinq bulles côte à côte, dans l'écran (${r0.map((b) => Math.round(b[0])).join(" ")})`);
    const b0 = await bulle(page); check(!b0.couvre, `${T} · la bulle ne couvre aucun exercice (${b0.place})`);
    await shot(page, "01-choisir-exercices");
    if (big) { const h = await hold(page, '[data-key="multiplication"]'); check(/multiplication/.test(h.label ?? ""), `${T} · appui long : l'étiquette de la multiplication (${h.label})`); await shot(page, "02-etiquette-multiplication"); await h.release(); }
    await resetSaid(page); await tap(page, '[data-key="multiplication"]', 1200);
    await page.waitForSelector('[data-key="9"]', { timeout: 15000 }); await page.waitForTimeout(600);
    check((await said(page)).includes("La multiplication."), `${T} · le toucher dit « La multiplication. » (${await said(page)})`);
    const tiles = await page.evaluate(() => [...document.querySelectorAll("[data-key]")].filter((e) => /^\d+$/.test(e.dataset.key) && e.isConnected).map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    check(tiles.length === 9, `${T} · les 9 niveaux (${tiles.length})`);
    check(tiles.every((b) => b[0] >= 0 && b[2] <= W && b[1] >= 0 && b[3] <= H && b[2] - b[0] >= 64 * W / 1280), `${T} · les 9 tuiles tiennent dans l'écran, assez grandes`);
    await shot(page, "03-choisir-niveaux");
    if (big) {
      await tap(page, ".legende", 600); const rows = await page.locator(".legende-ligne").count(); check(rows === 9, `${T} · la légende : 9 lignes (${rows})`);
      await shot(page, "04-legende"); await tap(page, ".legende-fermer", 600);
      const h = await hold(page, '[data-key="6"]');
      check(h.label === "multiplication 6", `${T} · appui long sur la tuile 6 : son étiquette (${h.label})`); await shot(page, "04b-etiquette-tuile-6"); await h.release();
    }
    check(!errors.length, `${T} · 1 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 2. le niveau 1 : la leçon L13, l'exemple guidé, la question avec les rangées, une bonne réponse, une erreur M1
  {
    const { page, context, errors } = await open("&choix=5:1&cran=conseille&sans=echauffement&questions=8");
    await tap(page, ".play");
    await page.waitForFunction(() => window.__said.some((t) => /rangée/.test(t)), null, { timeout: 60000 }); await page.waitForTimeout(1500);
    await shot(page, "05-L13-rangees");
    const b1 = await bulle(page); check(!b1.couvre, `${T} · L13 : la bulle ne couvre rien de ce qu'on touche (${b1.place})`);
    await page.waitForFunction(() => window.__said.some((t) => /^12$|douze|font 12|ça fait 12/.test(t)), null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(1200);
    if (big) await shot(page, "06-L13-comptees");
    // l'exemple guidé : les rangées en grand, comptées
    await page.waitForFunction(() => window.__app.facts?.q?.guide, null, { timeout: 120000 });
    await page.waitForFunction(() => /rangées? de/.test(window.__said.at(-1) ?? "") || /^\d+$/.test(window.__said.at(-1) ?? ""), null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(900);
    const rg = await board(page); check(rowsOk(rg), `${T} · l'exemple guidé : les rangées sous l'ardoise, dans l'écran (${rg})`);
    await shot(page, "07-exemple-guide");
    const lec = await page.evaluate(() => (window.__app.session.rec.lecons ?? []).map((l) => l.id).join(","));
    check(lec.includes("L13"), `${T} · le niveau 1 jamais travaillé : sa leçon L13 d'abord (${lec})`);
    await note(page, "niveau 1 choisi : la leçon L13, puis l'exemple guidé");
    // l'exemple fini : « À toi ! », l'enfant tape la réponse de l'exemple ; les petites rangées sont revenues
    await qOpen(page, 60000); await page.waitForTimeout(400);
    const rb = await board(page); check(rowsOk(rb) && rb[3] < 500, `${T} · après l'exemple : les petites rangées au-dessus du pavé (${rb})`);
    for (let i = 0; i < 3 && (await q(page)).guide; i++) { await typeIn(page, (await q(page)).attendu); await page.waitForTimeout(1500); await qOpen(page, 60000); }
    await page.waitForFunction(() => { const s = window.__app.facts; return s?.q && !s.q.guide && s.resolve && !s.locked; }, null, { timeout: 120000, polling: 100 }); await page.waitForTimeout(500);
    let x = await q(page);
    check(x.module === 5 && x.niveau === 1 && x.addition && x.image === "toujours", `${T} · une question du niveau 1 : en addition, les rangées affichées (${x.a} × ${x.b}, ${x.image})`);
    const rq = await board(page); check(rowsOk(rq) && rq[3] < 500, `${T} · les petites rangées entre l'ardoise et le pavé (${rq})`);
    await shot(page, `08-question-${x.a}x${x.b}`);
    await typeIn(page, x.attendu); await page.waitForTimeout(1500); await qOpen(page); await resetSaid(page);
    // une erreur M1 : a additionné
    x = await q(page); const wrong = x.a + x.b === x.attendu ? x.attendu + 1 : x.a + x.b;
    await typeIn(page, wrong);
    await page.waitForFunction(() => window.__said.some((t) => /ça fait/.test(t)), null, { timeout: 30000 }).catch(() => {});
    await page.waitForFunction(() => window.__said.some((t) => /regardons ensemble/.test(t)), null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(400);
    const rc = await board(page); check(rowsOk(rc), `${T} · la correction : les rangées comptées (${rc})`);
    await shot(page, `09-correction-M1-${x.a}x${x.b}`);
    // (relecture du lot : au niveau 1, écrit en addition, pas de « fois, ce n'est pas plus »)
    const sc = await said(page); check(!/fois, ce n'est pas plus/.test(sc) && /regardons ensemble/.test(sc) && /ça fait/.test(sc), `${T} · niveau 1 : la correction dit « regardons ensemble », les rangées et le calcul (${sc.slice(0, 160)})`);
    await note(page, `une erreur M1 sur ${x.a} × ${x.b} (réponse ${wrong}) : la correction`);
    const err = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 5 && !r.juste).map((r) => r.erreur).at(-1));
    check(err === "M1", `${T} · l'erreur est rangée avec son code (${err})`);
    check(!errors.length, `${T} · 2 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 3. le niveau 3 : la table de 2, le coquillage, « je ne sais pas »
  {
    const { page, context, errors } = await open("&choix=5:3&cran=conseille&sans=echauffement&guides=0&sansLecon&questions=6");
    await tap(page, ".play"); await qOpen(page, 120000); await page.waitForTimeout(500);
    let x = await q(page); check(x.niveau === 3 && (x.a === 2 || x.b === 2) && x.image === "aide" && !(await board(page)), `${T} · la table de 2 : la question sans image (${x.a} × ${x.b})`);
    check((await visible(page, ".help")) === 1, `${T} · le coquillage est là`);
    await shot(page, `10-table-2-${x.a}x${x.b}`);
    await resetSaid(page); await tap(page, ".help", 300);
    await page.waitForFunction(() => window.__said.some((t) => /double/.test(t)), null, { timeout: 20000 }).catch(() => {});
    await page.waitForFunction(() => /^\d+$/.test(window.__said.at(-1) ?? ""), null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(250);
    const ra = await board(page); check(rowsOk(ra), `${T} · le coquillage : les rangées en grand (${ra})`);
    check(/Fois deux, c'est le double/.test(await said(page)), `${T} · l'astuce de la table de 2 (${(await said(page)).slice(0, 120)})`);
    await shot(page, `11-coquillage-${x.a}x${x.b}`);
    await note(page, `le coquillage sur ${x.a} × ${x.b}`);
    // (relecture du lot : le coquillage compte les rangées sans dire ni écrire le dernier total, la réponse)
    check(!new RegExp(`^${x.attendu}$`).test(await page.evaluate(() => window.__said.at(-1) ?? "")) || x.a === 1, `${T} · le coquillage ne dit pas la réponse (${await page.evaluate(() => window.__said.slice(-3).join(" | "))})`);
    await qOpen(page, 30000); await typeIn(page, x.attendu); await page.waitForTimeout(1500); await qOpen(page); await resetSaid(page);
    // une erreur M1 au niveau des tables : sa phrase
    let y = await q(page); await typeIn(page, y.a + y.b === y.attendu ? y.attendu + 1 : y.a + y.b);
    await page.waitForFunction(() => window.__said.some((t) => /ça fait/.test(t)), null, { timeout: 30000 }).catch(() => {});
    const s3 = await said(page); check(y.a + y.b === y.attendu || /fois, ce n'est pas plus/.test(s3), `${T} · table de 2 : l'erreur M1 dite (${y.a} × ${y.b} → ${y.a + y.b} : ${s3.slice(0, 120)})`);
    if (big) await shot(page, `11b-correction-M1-${y.a}x${y.b}`);
    await qOpen(page, 60000); await resetSaid(page);
    await nsp(page);
    await page.waitForFunction(() => window.__said.some((t) => /ça fait/.test(t)), null, { timeout: 30000 }); await page.waitForTimeout(500);
    if (big) await shot(page, "12-je-ne-sais-pas");
    await note(page, "« je ne sais pas »");
    check(!errors.length, `${T} · 3 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 4. le niveau 6 : le tour des rangées
  {
    const { page, context, errors } = await open("&choix=5:6&cran=conseille&sans=echauffement&guides=0&sansLecon&questions=4");
    await tap(page, ".play"); await qOpen(page, 120000); await page.waitForTimeout(800);
    const x = await q(page); check(x.niveau === 6 && x.tour && x.tour.a === x.b && x.tour.b === x.a, `${T} · le tour : ${x.tour?.a} × ${x.tour?.b} donné, ${x.a} × ${x.b} demandé`);
    const sc = await said(page); check(new RegExp(`${x.tour.a} fois ${x.tour.b}, ça fait ${x.n}\\. Et ${x.a} fois ${x.b} \\?`).test(sc), `${T} · la consigne dit la multiplication donnée, puis la question (${sc.slice(-80)})`);
    const rp = await board(page); check(rowsOk(rp), `${T} · la plaque du tour, sous l'ardoise (${rp})`);
    await shot(page, `13-tour-${x.tour.a}x${x.tour.b}`);
    await note(page, "le niveau 6, le tour");
    check(!errors.length, `${T} · 4 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 5. « très dur » au niveau 9 : les formes à trou ; « plus facile » au niveau 7 : les rangées d'emblée
  {
    const { page, context, errors } = await open("&choix=5:9&cran=tresdur&sans=echauffement&guides=0&sansLecon&questions=4");
    await tap(page, ".play"); await qOpen(page, 120000); await page.waitForTimeout(500);
    const seen = [];
    for (let i = 0; i < 2; i++) {
      const x = await q(page); seen.push(x.forme);
      check(x.forme !== "directe" && x.image === "non" && (await visible(page, ".help")) === 0, `${T} · très dur : ${x.forme} (${x.a} × ${x.b} = ${x.n}), sans coquillage`);
      if (i === 0 || big) await shot(page, `14-tresdur-${x.forme}`);
      await typeIn(page, x.attendu); await page.waitForTimeout(1500); await qOpen(page, 30000);
    }
    check(seen.includes("trouDroite") && seen.includes("trouGauche"), `${T} · un côté puis l'autre (${seen})`);
    check(!errors.length, `${T} · 5a : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }
  {
    const { page, context, errors } = await open("&choix=5:7&cran=facile&sans=echauffement&guides=0&sansLecon&questions=4");
    await tap(page, ".play");
    await page.waitForFunction(() => window.__app.facts?.q?.aideDEmblee, null, { timeout: 120000 }); await page.waitForTimeout(2600);
    const r = await board(page); check(rowsOk(r), `${T} · plus facile : les rangées comptées d'emblée (${r})`);
    await shot(page, "15-facile-demblee");
    check(!errors.length, `${T} · 5b : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 6. le menu des leçons : la rangée de la multiplication, les deux tables ; L14 jusqu'au bout, « À toi ! »
  {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(700);
    const keys = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile")].map((e) => e.dataset.key).join(","));
    check(keys === "L1,L2,L3,L10,L4,L5,L6,L11,L12,L7,L8,L9,L13,L14,table.addition,table.multiplication", `${T} · le menu : L13, L14 et les deux tables (${keys})`);
    const rr = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile, .lecons-rangee")].map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    check(rr.every((b) => b[0] >= 0 && b[2] <= W + 1 && b[3] <= H + 1), `${T} · les seize tuiles et les quatre pictogrammes tiennent dans l'écran`);
    const b = await bulle(page); check(!b.couvre, `${T} · la bulle du menu ne couvre aucune tuile (${b.place})`);
    await shot(page, "16-menu-lecons");
    if (big) { await tap(page, ".legende", 600); const n = await page.locator(".legende-ligne").count(); check(n === 16, `${T} · la légende du menu : 16 lignes (${n})`); await shot(page, "17-menu-legende"); await tap(page, ".legende-fermer", 400); }
    await resetSaid(page); await tap(page, '.lecons-tuile[data-key="L14"]');
    check((await said(page)).startsWith("On tourne les rangées."), `${T} · la tuile 14 dit « On tourne les rangées. » (${(await said(page)).slice(0, 60)})`);
    await page.waitForFunction(() => window.__said.some((t) => /tourne/.test(t) && !/^On tourne les rangées\.$/.test(t)), null, { timeout: 60000 }).catch(() => {}); await page.waitForTimeout(2500);
    await shot(page, "18-L14");
    await page.waitForSelector(".lecons-atoi", { timeout: 120000 }); await page.waitForTimeout(900);
    if (big) await shot(page, "19-fin-L14");
    await note(page, "le menu, la leçon 14 regardée jusqu'au bout, « À toi ! »");
    await tap(page, ".lecons-atoi"); await page.waitForSelector(".cran", { timeout: 20000 }); await tap(page, ".cran-ok");
    await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 30000 });
    const s = await page.evaluate(() => window.__app.session.rec.choix);
    check(s?.module === 5 && s.niveau === 6 && s.apresLecon === "L14", `${T} · « À toi ! » après L14 : la multiplication, niveau 6 (${JSON.stringify(s)})`);
    await qOpen(page, 120000); await page.waitForTimeout(500);
    const x = await q(page); check(x.module === 5 && !!x.tour, `${T} · une question du tour (${x.a} × ${x.b})`);
    check(!errors.length, `${T} · 6 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 7. la table de multiplication
  {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await resetSaid(page);
    await tap(page, '.lecons-tuile[data-key="table.multiplication"]'); await page.waitForSelector(".table-grille", { timeout: 10000 }); await page.waitForTimeout(800);
    check((await said(page)).includes("La table de multiplication."), `${T} · la tuile dit « La table de multiplication. » (${(await said(page)).slice(0, 80)})`);
    const g = await page.evaluate(() => { const b = document.querySelector(".table-grille").getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; });
    check(g[0] >= 0 && g[2] <= W && g[1] >= 0 && g[3] <= H, `${T} · la grille tient dans l'écran (${g.map(Math.round)})`);
    await shot(page, "20-table");
    const cellAt = (a, b2) => page.evaluate(([a, b2]) => { const g = document.querySelector(".table-grille").getBoundingClientRect(), k = window.__app.stage.k; return [g.left + (16 + 52 + (b2 - 1) * 64 + 32) * k, g.top + (16 + 52 + (a - 1) * 64 + 32) * k]; }, [a, b2]);
    for (const [a, b2, n] of [[3, 4, "21"], [10, 10, "22"], [7, 5, "23"]]) {
      await resetSaid(page);
      const [cx, cy] = await cellAt(a, b2); await page.touchscreen.tap(cx, cy); await page.waitForTimeout(700);
      check((await said(page)) === `${a} fois ${b2}, ${a * b2}.`, `${T} · la case ${a} × ${b2} dit « ${a} fois ${b2}, ${a * b2}. » (${await said(page)})`);
      if (big || a === 3) await shot(page, `${n}-table-${a}x${b2}`);
    }
    const b = await bulle(page); check(!b.couvre, `${T} · la bulle ne couvre pas la grille (${b.place})`);
    await note(page, "la table de multiplication : 3 × 4, 10 × 10, 7 × 5");
    check(!errors.length, `${T} · 7 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 8. l'espace parent : le bloc de la multiplication (après quelques réponses), le point de départ
  if (big) {
    const prep = `async () => { const { setMultLevel } = await import("./js/parent/depart.js"); await setMultLevel(window.__app.store, 3); const st = await window.__app.store.get("niveaux", 5); await window.__app.store.add("reponses", { t: Date.now(), module: 5, niveau: 3, question: "3 × 4", donnee: 7, attendue: 12, juste: false, erreur: "M1", tempsMs: 4000, notion: true }); void st; }`;
    const { page, context, errors } = await open("", prep);
    await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
    page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
    for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
    await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(900);
    const has = await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].some((h) => /Module 5 · La multiplication/.test(h.textContent)));
    check(has, `${T} · l'espace parent : le bloc « Module 5 · La multiplication »`);
    await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].find((h) => /Module 5/.test(h.textContent))?.scrollIntoView()); await page.waitForTimeout(300);
    await shot(page, "24-parent-multiplication");
    const j = await page.evaluate(() => document.body.textContent.includes("a additionné au lieu de multiplier"));
    check(j, `${T} · le journal des erreurs : M1, « a additionné au lieu de multiplier »`);
    check(!errors.length, `${T} · 8 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }
}

if (journal.length) writeFileSync(join(OUT, "1280-phrases.json"), JSON.stringify(journal, null, 2));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nTout est bon.");
process.exit(fail.length ? 1 : 0);
