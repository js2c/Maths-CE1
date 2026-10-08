// LOT « SOMMES JUSQU'À 30 » (docs/LOTS.md, fiche 4 ; docs/maquettes/sommes30/PROPOSITION.md ; docs/SPEC.md, section 6) : le
// parcours de chaque situation nouvelle, en 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures dans
// tests/e2e/out/sommes30 :
//  1. « choisir », les additions : 13 familles, les vignettes des familles 8 à 13 ; l'appui long sur la tuile 12 ;
//  2. la famille 12 choisie (passer la dizaine), cran « plus facile » : la leçon d'entrée L12 (les deux boîtes, les poissons
//     qui sautent), puis l'aide affichée d'emblée (les deux boîtes), une erreur et sa correction (« 2 pour faire dix, il en
//     reste 3. »), « je ne sais pas » ;
//  3. la famille 9 (les doubles jusqu'à 15 + 15) et la famille 10 (presque-doubles) : les appuis, dont le grand double ;
//  4. les formes à trou des deux boîtes (les places qui brillent), la famille 8 (dix et quelques) ;
//  5. la leçon L11, jouée depuis le menu des leçons (douze leçons), puis « À toi ! » : la famille 8 ;
//  6. la table d'addition : 10 + 4 (les deux boîtes), 7 + 8 (le double + 1), 9 + 9 (le reflet) ;
//  7. le défi et l'échauffement avec des faits au-delà de 10 (deux chiffres au pavé).
//   node tests/e2e/sommes30.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "./navigateur.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(opt("--out", "tests/e2e/out/sommes30")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
// les familles 1 à `n` connues (point de départ du parent), pour que la famille voulue soit la famille en cours
const KNOWN = (n) => `async () => { const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f <= ${n}; f++) await markFamilyKnown(window.__app.store, m2, f); }`;
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
  const q = (page) => page.evaluate(() => { const f = window.__app.facts.q; return { a: f.a, b: f.b, forme: f.forme ?? "directe", appui: f.appui, famille: f.famille, guide: !!f.guide, attendu: f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b }; });
  const cdps = new WeakMap(), cdpOf = async (page) => { if (!cdps.has(page)) cdps.set(page, await page.context().newCDPSession(page)); return cdps.get(page); };
  const hold = async (page, sel, ms = 800) => {
    const r = await page.locator(sel).first().boundingBox(), cdp = await cdpOf(page), x = r.x + r.width / 2, y = r.y + r.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await page.waitForTimeout(ms);
    const label = await page.evaluate(() => document.querySelector(".etiquette:not([data-sortie])")?.dataset.pour ?? null);
    return { label, release: async () => { await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(600); } };
  };
  // dessine un appui sur le calque des aides, comme l'écran des additions le fait pour une question (captures des cas rares)
  const aid = (page, fq, solved) => page.evaluate(([fq, solved]) => { const s = window.__app.facts; s.q = { ...s.q, ...fq }; s.keys(false); return s.paintAid(s.q, solved); }, [fq, solved]);
  const board = (page) => page.evaluate(() => { const c = document.querySelector("canvas.aid-board"); if (!c?.width) return null; const x = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let y0 = 1e9, y1 = -1, x0 = 1e9, x1 = -1; for (let y = 0; y < c.height; y += 4) for (let i = 0; i < c.width; i += 4) if (x[(y * c.width + i) * 4 + 3]) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); x0 = Math.min(x0, i); x1 = Math.max(x1, i); } const k = c.width / 1280; return y1 < 0 ? null : [x0 / k, y0 / k, x1 / k, y1 / k].map(Math.round); });
  // l'appui ne touche ni l'ardoise (jusqu'à y 332) ni les bords de la scène
  const aidOk = (r) => r && r[1] >= 330 && r[3] <= 800 && r[0] >= 0 && r[2] <= 1280;

  // 1. « choisir », les additions : 13 familles
  {
    const { page, context, errors } = await open();
    await tap(page, ".choisir", 900); await page.waitForSelector('.choice-ex[data-key="additions"], [data-key="additions"]', { timeout: 15000 });
    await tap(page, '[data-key="additions"]', 450); await tap(page, '[data-key="additions"]', 1200); // (deux touchers)
    await page.waitForSelector('.choice-tile, [data-key="12"]', { timeout: 15000 }); await page.waitForTimeout(600);
    const n = await page.evaluate(() => [...document.querySelectorAll("[data-key]")].filter((e) => /^\d+$/.test(e.dataset.key) && e.isConnected).length);
    check(n === 13, `${T} · « choisir », les additions : 13 familles (${n})`);
    const r = await page.evaluate(() => [...document.querySelectorAll("[data-key]")].filter((e) => /^\d+$/.test(e.dataset.key)).map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    check(r.every((b) => b[0] >= 0 && b[2] <= W && b[1] >= 0 && b[3] <= H), `${T} · les 13 tuiles tiennent dans l'écran`);
    await shot(page, "01-choisir-familles");
    if (big) { const h = await hold(page, '[data-key="12"]'); check(!!h.label, `${T} · appui long sur la tuile 12 : son étiquette (${h.label})`); await shot(page, "02-etiquette-famille-12"); await h.release(); }
    check(!errors.length, `${T} · 1 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 2. la famille 12 choisie, cran « plus facile » : L12, l'aide d'emblée, une erreur, « je ne sais pas »
  {
    const { page, context, errors } = await open("&choix=2:12&cran=facile&sans=echauffement&questions=6", KNOWN(11));
    await tap(page, ".play");
    await page.waitForSelector(".skip", { timeout: 30000 });
    await page.waitForFunction(() => (window.__app.session?.rec?.lecons ?? []).length || window.__app.lessons?.playing || document.querySelector(".lessonkey"), null, { timeout: 30000 });
    const lec = () => page.evaluate(() => (window.__app.session.rec.lecons ?? []).map((l) => l.id).join(","));
    // les moments de la leçon : les deux boîtes, puis les poissons qui sautent
    await page.waitForFunction(() => window.__said.some((t) => /Et cinq dans la deuxième/.test(t)), null, { timeout: 60000 }); await page.waitForTimeout(1500);
    await shot(page, "03-L12-deux-boites");
    await page.waitForFunction(() => window.__said.some((t) => /sautent pour la remplir/.test(t)), null, { timeout: 60000 }); await page.waitForTimeout(2200);
    const b1 = await bulle(page); check(!b1.couvre, `${T} · L12 : la bulle ne couvre rien de ce qu'on touche (${b1.place})`);
    await shot(page, "04-L12-poissons-qui-sautent");
    await page.waitForFunction(() => window.__said.some((t) => /un seul poisson saute/.test(t)), null, { timeout: 60000 }); await page.waitForTimeout(2500);
    if (big) await shot(page, "05-L12-neuf-plus-quatre");
    await qOpen(page, 120000); await page.waitForTimeout(400);
    check((await lec()).includes("L12"), `${T} · la famille 12 jamais travaillée : sa leçon L12 d'abord (${await lec()})`);
    await note(page, "famille 12 choisie, cran « plus facile » : la leçon L12, puis la première question");
    // l'aide affichée d'emblée (cran « plus facile ») : à la question suivante, on la capture pendant qu'elle est montrée
    let x = await q(page);
    check(x.famille === 12 || x.appui === "deuxCadres" || x.a + x.b > 10, `${T} · une question de la famille 12 (${x.a} + ${x.b}, ${x.appui})`);
    await typeIn(page, x.attendu);
    await page.waitForFunction(() => window.__app.aidBoard?.used, null, { timeout: 30000 }); await page.waitForTimeout(1600);
    const r1 = await board(page); x = await q(page);
    check(aidOk(r1), `${T} · l'aide d'emblée : l'appui sous l'ardoise, dans l'écran (${r1})`);
    await shot(page, `06-aide-demblee-${x.a}+${x.b}-${x.appui}`);
    await qOpen(page); await resetSaid(page);
    // une erreur : la correction montre les deux boîtes et dit « On complète la boîte avec c, il en reste r »
    x = await q(page); await typeIn(page, x.attendu === 13 ? 3 : (x.attendu % 10) || 1);
    await page.waitForFunction(() => window.__said.some((t) => /complète la boîte|boîte pleine|reflet|double|dix et/.test(t)), null, { timeout: 30000 }); await page.waitForTimeout(900);
    const r2 = await board(page); check(aidOk(r2), `${T} · la correction : l'appui sous l'ardoise (${r2})`);
    await shot(page, `07-correction-${x.a}+${x.b}`);
    const sc = await said(page); check(/ça fait/.test(sc) || /complète la boîte|boîte pleine|reflet|double/.test(sc), `${T} · la correction dit l'appui et le calcul (${sc.slice(0, 140)})`);
    await note(page, `une erreur sur ${x.a} + ${x.b} : la correction`);
    const err = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => !r.juste).map((r) => r.erreur ?? r.code).at(-1));
    check(!!err, `${T} · l'erreur est rangée avec son code (${err})`);
    await qOpen(page); await resetSaid(page);
    await page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); });
    await page.waitForFunction(() => window.__said.some((t) => /Ce n'est pas grave/.test(t)), null, { timeout: 20000 }); await page.waitForTimeout(1500);
    if (big) await shot(page, "08-je-ne-sais-pas");
    await note(page, "« je ne sais pas »");
    check(!errors.length, `${T} · 2 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 3 et 4. les appuis de chaque famille nouvelle, à toutes les formes (dessinés sur une question de la famille 9)
  {
    const { page, context, errors } = await open("&choix=2:9&cran=conseille&sans=echauffement&guides=0&sansLecon", KNOWN(8));
    await tap(page, ".play");
    await qOpen(page, 120000); await page.waitForTimeout(600);
    const x = await q(page); check(x.famille === 9 || x.appui === "reflet", `${T} · la famille 9 : un double (${x.a} + ${x.b}, ${x.appui})`);
    if (big) await shot(page, "09-famille-9-question");
    const cases = [
      [{ a: 13, b: 13, forme: "directe", appui: "reflet" }, false, "10-grand-double-13+13"],
      [{ a: 9, b: 9, forme: "directe", appui: "reflet" }, true, "11-reflet-9+9"],
      [{ a: 7, b: 8, forme: "directe", appui: "doublePlus" }, false, "12-double-plus-un-7+8"],
      [{ a: 8, b: 5, forme: "directe", appui: "deuxCadres" }, true, "13-deux-boites-8+5"],
      [{ a: 9, b: 4, forme: "trouDroite", appui: "deuxCadres" }, false, "14-deux-boites-9+trou=13"],
      [{ a: 6, b: 8, forme: "trouGauche", appui: "deuxCadres" }, false, "15-deux-boites-trou+8=14"],
      [{ a: 4, b: 10, forme: "directe", appui: "deuxCadres" }, true, "16-dix-et-quelques-4+10"],
      [{ a: 10, b: 7, forme: "trouDroite", appui: "deuxCadres" }, false, "17-dix-et-quelques-10+trou=17"],
    ];
    for (const [fq, solved, name] of cases) {
      const k = await aid(page, fq, solved); await page.waitForTimeout(300);
      const r = await board(page); check(aidOk(r), `${T} · ${name} : l'appui « ${k} » sous l'ardoise, dans l'écran (${r})`);
      if (big || name.startsWith("13") || name.startsWith("10")) await shot(page, name);
    }
    check(!errors.length, `${T} · 3 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 5. la leçon L11 depuis le menu des leçons, puis « À toi ! » : la famille 8
  {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(700);
    const keys = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile")].map((e) => e.dataset.key).join(","));
    check(keys === "L1,L2,L3,L10,L4,L5,L6,L11,L12,L7,L8,L9,L13,L14,table.addition,table.multiplication", `${T} · le menu : L11 et L12 dans la rangée des additions (${keys})`);
    const rr = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile")].map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    check(rr.every((b) => b[0] >= 0 && b[2] <= W + 1 && b[3] <= H + 1), `${T} · les seize tuiles tiennent dans l'écran`);
    const b = await bulle(page); check(!b.couvre, `${T} · la bulle du menu ne couvre aucune tuile (${b.place})`);
    await shot(page, "18-menu-lecons");
    await resetSaid(page);
    await tap(page, '.lecons-tuile[data-key="L11"]', 450); await tap(page, '.lecons-tuile[data-key="L11"]');
    check((await said(page)).startsWith("Dix et encore."), `${T} · la tuile 11 dit « Dix et encore. »`);
    await page.waitForFunction(() => window.__said.some((t) => /Dix et quatre/.test(t)), null, { timeout: 60000 }); await page.waitForTimeout(1200);
    await shot(page, "19-L11-dix-et-quatre");
    await page.waitForSelector(".lecons-atoi", { timeout: 120000 }); await page.waitForTimeout(900);
    if (big) await shot(page, "20-fin-L11");
    await note(page, "le menu, la leçon 11 regardée jusqu'au bout, « À toi ! »");
    await tap(page, ".lecons-atoi"); await page.waitForSelector(".cran", { timeout: 20000 }); await tap(page, ".cran-ok");
    await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 30000 });
    const s = await page.evaluate(() => window.__app.session.rec.choix);
    check(s?.module === 2 && s.famille === 8 && s.apresLecon === "L11", `${T} · « À toi ! » après L11 : les additions, famille 8 (${JSON.stringify(s)})`);
    await qOpen(page, 120000); await page.waitForTimeout(500);
    const x = await q(page); check(x.a === 10 || x.b === 10, `${T} · une question « dix et quelques » (${x.a} + ${x.b})`);
    await shot(page, "21-famille-8-question");
    check(!errors.length, `${T} · 5 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 6. la table d'addition : les appuis au-delà de 10
  if (big) {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await tap(page, '.lecons-tuile[data-key="table.addition"]', 450); await tap(page, '.lecons-tuile[data-key="table.addition"]'); await page.waitForSelector(".table-grille", { timeout: 10000 }); await page.waitForTimeout(800);
    const cellAt = (a, b2) => page.evaluate(([a, b2]) => { const g = document.querySelector(".table-grille").getBoundingClientRect(), k = window.__app.stage.k; return [g.left + (16 + 52 + b2 * 64 + 32) * k, g.top + (16 + 52 + a * 64 + 32) * k]; }, [a, b2]);
    for (const [a, b2, n] of [[10, 4, "dix-et-quatre"], [7, 8, "double-plus-un"], [9, 9, "reflet"], [8, 5, "deux-boites"]]) {
      const [cx, cy] = await cellAt(a, b2); await page.touchscreen.tap(cx, cy); await page.waitForTimeout(700); await shot(page, `22-table-${a}+${b2}-${n}`);
    }
    check(!errors.length, `${T} · 6 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 7. l'échauffement avec des faits au-delà de 10 : deux chiffres au pavé
  {
    const { page, context, errors } = await open("&cran=conseille&module=1&faits=6", KNOWN(10));
    await tap(page, ".play");
    await qOpen(page, 90000); await page.waitForTimeout(400);
    let seen = null;
    for (let i = 0; i < 10 && !seen; i++) {
      const x = await q(page);
      if (x.a + x.b > 10) { seen = x; await shot(page, "23-echauffement-grand-fait"); }
      await typeIn(page, x.attendu); await page.waitForTimeout(400);
      try { await qOpen(page, 15000); } catch { break; }
    }
    check(!!seen, `${T} · l'échauffement pose des faits au-delà de 10 quand leurs familles sont ouvertes (${seen ? `${seen.a} + ${seen.b}` : "aucun"})`);
    check(!errors.length, `${T} · 7 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }
}
writeFileSync(join(OUT, "phrases.json"), JSON.stringify(journal, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} ÉCHEC(S)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
