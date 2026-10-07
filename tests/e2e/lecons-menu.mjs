// LOT « LES LEÇONS » (docs/LOTS.md, fiche 3 ; docs/SPEC.md, section 3, « Les leçons ») : le parcours de chaque situation
// nouvelle, en 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures dans tests/e2e/out/lecons-menu :
//  1. l'accueil à cinq bulles ; l'appui long sur « les leçons » (étiquette, rien ne se lance) ; le menu (dix leçons, la table,
//     trois pictogrammes de rangée, le petit livre) ; l'appui long sur une tuile ; la légende du parent ;
//  2. une leçon regardée jusqu'au bout, puis « À toi ! » : 3 étoiles, l'écran « À toi ! » (une seule maison), le sélecteur,
//     puis l'exercice associé comme séance du jour, sans échauffement (« après une leçon »), sans salut ni leçon d'entrée ;
//     la pause pendant cet exercice : l'accueil en pause a la bulle « les leçons » ; une leçon depuis la pause revient à la
//     pause sans « À toi ! » ; la table depuis la pause, puis la maison ; la reprise ;
//  3. séance du jour déjà faite : une leçon passée (pas d'étoiles), puis « À toi ! » : de l'entraînement libre ;
//  4. la table d'addition : la consigne, une case (« 7 plus 5, 12. »), la case touchée deux fois très vite (une seule phrase),
//     deux cases à la suite (la dernière l'emporte), les appuis de chaque famille, la bulle sous la tête, la maison ;
//  5. la maison pendant une leçon du menu : retour à l'accueil, sans « À toi ! » ;
//  6. L10 : le chalut plein de dix filets de dix poissons.
//   node tests/e2e/lecons-menu.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(opt("--out", "tests/e2e/out/lecons-menu")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TODAY = async () => { const n = Date.now(); await window.__app.store.add("seances", { debut: n - 600000, fin: n - 1000, terminee: true, module: 1, etapes: [] }); };

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]].filter(([w]) => !SEUL || String(w) === SEUL)) {
  const T = `${W}`, big = W === 1280;
  const open = async (q = "", prep = null) => {
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
    if (prep) await page.evaluate(prep);
    await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
    return { page, context, errors };
  };
  const shot = (page, n) => page.screenshot({ path: join(OUT, `${T}-${n}.png`) });
  const tap = async (page, sel, wait = 250) => { await page.tap(sel, { force: true }); await page.waitForTimeout(wait); };
  const said = (page) => page.evaluate(() => window.__said.join(" | "));
  // les phrases dites, gardées pour la relecture (tests/recette-fonctionnelle/out-lecons/SEQUENCES.md)
  const journal = []; const note = async (page, quoi) => journal.push({ quoi, dit: await page.evaluate(() => [...window.__said]) });
  const resetSaid = (page) => page.evaluate(() => { window.__said = []; });
  const visible = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden" && !e.closest(".stash")).length, sel);
  const bulle = (page) => page.evaluate(() => window.__app.bulle.etat());
  // un appui tenu (vrai toucher) : l'étiquette, puis le lever du doigt ; rien ne doit se lancer
  const cdps = new WeakMap(), cdpOf = async (page) => { if (!cdps.has(page)) cdps.set(page, await page.context().newCDPSession(page)); return cdps.get(page); };
  const hold = async (page, sel, ms = 800) => {
    const r = await page.locator(sel).first().boundingBox(), cdp = await cdpOf(page), x = r.x + r.width / 2, y = r.y + r.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await page.waitForTimeout(ms);
    const label = await page.evaluate(() => document.querySelector(".etiquette:not([data-sortie])")?.dataset.pour ?? null);
    return { label, release: async () => { await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(600); } };
  };
  // la case (a, b) de la table : son centre, en px de la page
  const cellAt = async (page, a, b) => page.evaluate(([a, b]) => { const g = document.querySelector(".table-grille").getBoundingClientRect(), k = window.__app.stage.k; return [g.left + (16 + 52 + b * 64 + 32) * k, g.top + (16 + 52 + a * 64 + 32) * k]; }, [a, b]);
  const tapCell = async (page, a, b) => { const [x, y] = await cellAt(page, a, b); await page.touchscreen.tap(x, y); };

  // 1. l'accueil, le menu, les étiquettes, la légende
  {
    const { page, context, errors } = await open();
    await page.waitForSelector(".leconskey"); await page.waitForTimeout(500);
    check((await visible(page, ".play, .choisir, .leconskey, .reefkey, .albumkey")) === 5, `${T} · l'accueil : jouer, choisir, les leçons, le récif, l'album`);
    const xs = await page.evaluate(() => [".play", ".choisir", ".leconskey", ".reefkey", ".albumkey"].map((s) => document.querySelector(s).getBoundingClientRect()).map((r) => [Math.round(r.x), Math.round(r.right)]));
    check(xs.every((r, i) => !i || r[0] >= xs[i - 1][1] - 2) && xs.at(-1)[1] <= W, `${T} · cinq bulles côte à côte, dans l'écran (${xs.map((r) => r.join("-")).join(" ")})`);
    await shot(page, "01-accueil");
    const h = await hold(page, ".leconskey"); check(h.label === "les leçons", `${T} · appui long sur « les leçons » : l'étiquette (${h.label})`);
    if (big) await shot(page, "02-accueil-etiquette");
    await h.release(); check((await page.locator(".lecons-tuile").count()) === 0, `${T} · l'appui long ne lance rien`);
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(700);
    check((await page.locator(".lecons-tuile").count()) === 11, `${T} · le menu : dix leçons et la table d'addition`);
    check((await page.locator(".lecons-rangee").count()) === 3 && (await page.locator(".legende").count()) === 1, `${T} · trois pictogrammes de rangée et le petit livre`);
    check(/Les leçons\. \| Quelle leçon veux-tu regarder \? Touche-la\./.test(await said(page)), `${T} · « Les leçons. », puis la consigne du menu`);
    const keys = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile")].map((e) => e.dataset.key).join(","));
    check(keys === "L1,L2,L3,L10,L4,L5,L6,L7,L8,L9,table.addition", `${T} · l'ordre des tuiles (${keys})`);
    const b = await bulle(page); check(b.visible && !b.couvre, `${T} · la bulle du menu ne couvre aucune tuile (${b.place})`);
    await shot(page, "03-menu"); await note(page, "accueil, puis la bulle « les leçons »");
    const t7 = await hold(page, '.lecons-tuile[data-key="L7"]'); check(t7.label === "L7", `${T} · appui long sur la tuile 7 : son étiquette`);
    if (big) await shot(page, "04-menu-etiquette");
    await t7.release(); check(!(await page.evaluate(() => window.__app.lessons.p ?? window.__app.lessons.p2?.p ?? null)) && (await page.locator(".lecons-tuile").count()) === 11, `${T} · l'appui long ne lance pas la leçon`);
    await tap(page, ".legende", 600);
    const rows = await page.locator(".legende-ligne").count(); check(rows === 11, `${T} · la légende du parent : une ligne par leçon et une pour la table (${rows})`);
    await shot(page, "05-legende");
    await tap(page, ".legende-fermer", 400);
    await tap(page, ".homekey", 800); check((await visible(page, ".leconskey")) === 1 && (await page.locator(".lecons-tuile").count()) === 0, `${T} · la maison ramène le menu à l'accueil`);
    check(!errors.length, `${T} · 1 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 2. une leçon regardée, « À toi ! » en séance du jour, la pause pendant l'exercice, une leçon et la table depuis la pause
  {
    const { page, context, errors } = await open();
    const t0 = await page.evaluate(() => window.__app.rewards.total);
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(400);
    await tap(page, '.lecons-tuile[data-key="L1"]');
    await page.waitForSelector(".skip", { timeout: 15000 }); await page.waitForTimeout(1200);
    if (big) await shot(page, "06-lecon-L1");
    await page.waitForSelector(".lecons-atoi", { timeout: 120000 }); await page.waitForTimeout(900);
    const t1 = await page.evaluate(() => window.__app.rewards.total);
    check(t1 - t0 === 3, `${T} · leçon regardée jusqu'au bout : 3 étoiles (${t1 - t0})`);
    check((await visible(page, ".lecons-atoi")) === 1 && (await visible(page, ".lecons-maison")) === 1 && (await visible(page, ".homekey")) === 0, `${T} · fin de leçon : « À toi ! » et la grande maison, seule maison`);
    check((await said(page)).includes("À toi ! Touche la grande bulle pour t'entraîner."), `${T} · « À toi ! Touche la grande bulle pour t'entraîner. »`);
    const bf = await bulle(page); check(!bf.couvre, `${T} · la bulle ne couvre ni « À toi ! » ni la maison (${bf.place})`);
    const rec = await page.evaluate(async () => (await window.__app.store.all("seances")).at(-1));
    check(rec.leconChoisie && rec.lecons?.[0]?.id === "L1" && rec.lecons[0].vue && rec.libre, `${T} · la leçon est notée vue (séance « libre »)`);
    await shot(page, "07-fin-L1"); await note(page, "le menu, la leçon 1 regardée jusqu'au bout, l'écran « À toi ! »");
    await page.waitForTimeout(13000); check((await visible(page, ".lecons-atoi")) === 1 && !(await page.evaluate(() => window.__app.session)), `${T} · sans toucher, rien ne se lance (13 s)`);
    await resetSaid(page);
    await tap(page, ".lecons-atoi");
    await page.waitForSelector(".cran", { timeout: 20000 }); await page.waitForTimeout(500);
    check(/À toi !|À ton tour !/.test(await said(page)), `${T} · la voix dit « À toi ! »`);
    if (big) await shot(page, "08-selecteur");
    await tap(page, ".cran-ok");
    await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 30000 });
    const s = await page.evaluate(() => { const r = window.__app.session.rec; return { choix: r.choix, et: r.etapes, module: r.module, libre: r.libre }; });
    check(s.module === 1 && s.choix?.niveau === 1 && s.choix?.apresLecon === "L1" && !s.libre, `${T} · « À toi ! » : la ligne, niveau 1, séance du jour (${JSON.stringify(s.choix)})`);
    check(s.et.some((e) => e.id === "echauffement" && e.sautee === "après une leçon"), `${T} · sans échauffement, noté « après une leçon »`);
    const txt = await said(page); check(!/Bienvenue|Bonsoir/.test(txt), `${T} · ni salut ni bienvenue avant l'exercice`);
    await page.waitForFunction(() => { const s = window.__app.screen; return s?.resolve && !s.locked; }, null, { timeout: 60000 });
    const lec = await page.evaluate(() => (window.__app.session.rec.lecons ?? []).map((l) => l.id));
    check(!lec.includes("L1") && !(await page.evaluate(() => window.__app.lessons.playing)), `${T} · pas de leçon d'entrée : la leçon vient d'être vue (${lec.join(",")})`);
    await page.waitForTimeout(600); await shot(page, "09-exercice-apres-L1"); await note(page, "« À toi ! », le sélecteur, puis l'exercice de la leçon 1");
    // la pause pendant l'exercice qui suit
    await tap(page, ".homekey", 900);
    check(await page.evaluate(() => window.__app.enPause), `${T} · la maison met l'exercice en pause`);
    check((await visible(page, ".keep.leconskey")) === 1, `${T} · l'accueil en pause a la bulle « les leçons »`);
    await shot(page, "10-pause");
    await tap(page, ".keep.leconskey"); await page.waitForSelector(".lecons-tuile", { timeout: 15000 }); await page.waitForTimeout(400);
    if (big) await shot(page, "11-pause-menu");
    await tap(page, '.lecons-tuile[data-key="L4"]'); await page.waitForSelector(".skip", { timeout: 15000 });
    await page.waitForFunction(() => document.querySelector(".keep.play") && getComputedStyle(document.querySelector(".keep.play")).visibility !== "hidden" && !document.querySelector(".skip"), null, { timeout: 120000 });
    await page.waitForTimeout(600);
    check((await page.locator(".lecons-atoi").count()) === 0 && await page.evaluate(() => window.__app.enPause), `${T} · une leçon depuis la pause revient à la pause, sans « À toi ! »`);
    await tap(page, ".keep.leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await tap(page, '.lecons-tuile[data-key="table.addition"]'); await page.waitForSelector(".table-grille", { timeout: 10000 }); await page.waitForTimeout(500);
    await tapCell(page, 4, 4); await page.waitForTimeout(700);
    if (big) await shot(page, "12-pause-table");
    await tap(page, ".homekey", 900);
    check(await page.evaluate(() => window.__app.enPause) && (await visible(page, ".keep.play")) === 1 && (await page.locator(".table-grille").count()) === 0, `${T} · la table depuis la pause : la maison ramène à la pause`);
    await tap(page, ".keep.play", 1200);
    check(!(await page.evaluate(() => window.__app.enPause)) && (await page.evaluate(() => window.__app.session.progress.etape)) === "notion", `${T} · reprise de l'exercice`);
    check(!errors.length, `${T} · 2 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 3. séance du jour faite : une leçon passée, puis « À toi ! » en entraînement libre
  {
    const { page, context, errors } = await open("", TODAY);
    await page.waitForSelector(".again"); await page.waitForTimeout(400);
    check((await visible(page, ".again, .leconskey, .reefkey, .albumkey")) === 4, `${T} · après la séance du jour : Encore !, les leçons, le récif, l'album`);
    check(/regarder les leçons/.test(await page.evaluate(() => window.__app.voice.instruction)), `${T} · la consigne de l'accueil après la séance cite les leçons`);
    await shot(page, "13-accueil-seance-faite");
    const t0 = await page.evaluate(() => window.__app.rewards.total);
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await tap(page, '.lecons-tuile[data-key="L5"]'); await page.waitForSelector(".skip", { timeout: 15000 }); await page.waitForTimeout(600);
    await tap(page, ".skip");
    await page.waitForSelector(".lecons-atoi", { timeout: 20000 }); await page.waitForTimeout(700);
    check((await page.evaluate(() => window.__app.rewards.total)) === t0, `${T} · leçon passée : pas d'étoiles, mais l'écran « À toi ! »`);
    check(!(await page.evaluate(() => { const c = document.querySelector("canvas.aid-board"); if (!c || !c.width) return false; const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 64) if (d[i]) return true; return false; })), `${T} · rien de la leçon ne reste dessiné derrière « À toi ! »`);
    await shot(page, "14-fin-L5-passee");
    await tap(page, ".lecons-atoi");
    await page.waitForSelector(".cran.free", { timeout: 20000 }); await page.waitForTimeout(300);
    await tap(page, ".cran-ok");
    await page.waitForFunction(() => window.__app.free?.runner && window.__app.facts?.resolve && !window.__app.facts.locked, null, { timeout: 60000 });
    const f = await page.evaluate(() => ({ rec: window.__app.free.rec, fam: window.__app.free.runner.famille }));
    check(f.rec?.libre && f.rec.apresLecon === "L5" && f.fam === 3, `${T} · « À toi ! » après la séance du jour : les amis de 10 en entraînement libre (famille ${f.fam})`);
    await page.waitForTimeout(500); await shot(page, "15-libre-apres-L5"); await note(page, "séance du jour faite : la leçon 5 passée, « À toi ! », l'entraînement libre");
    await tap(page, ".homekey", 900); check((await visible(page, ".again")) === 1, `${T} · la maison quitte l'entraînement libre`);
    check(!errors.length, `${T} · 3 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 4. la table d'addition
  {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await resetSaid(page);
    await tap(page, '.lecons-tuile[data-key="table.addition"]');
    await page.waitForSelector(".table-grille", { timeout: 10000 }); await page.waitForTimeout(1200);
    check(/La table d'addition\. \| Touche une case : je te dis le calcul\./.test(await said(page)), `${T} · « La table d'addition. », puis la consigne`);
    check((await visible(page, ".stars")) === 0, `${T} · pas de compteur d'étoiles sur la table`);
    const g = await page.locator(".table-grille").boundingBox(); check(g.y >= 0 && g.y + g.height <= H + 1 && g.x + g.width <= W, `${T} · la grille tient dans l'écran`);
    await shot(page, "16-table");
    await resetSaid(page); await tapCell(page, 7, 5); await page.waitForTimeout(500);
    check((await said(page)) === "7 plus 5, 12.", `${T} · une case : « 7 plus 5, 12. » (${await said(page)})`);
    check((await page.evaluate(() => document.querySelector(".table-grille").dataset.case)) === "7+5", `${T} · la case 7 + 5 allumée`);
    await page.waitForTimeout(300); const bt = await bulle(page);
    check(bt.visible && bt.place === "dessous-table" && !bt.couvre, `${T} · la bulle sous la tête, sans couvrir la grille (${bt.place}, ${bt.couvre})`);
    await shot(page, "17-table-7+5"); await note(page, "la table d'addition, la case 7 + 5");
    // deux fois très vite la même case : une seule phrase ; deux cases à la suite : la dernière l'emporte
    await resetSaid(page);
    // (deux contacts à 40 ms l'un de l'autre, émis dans la page : un toucher envoyé par le protocole du navigateur attend
    // l'image suivante, plus de 150 ms)
    const n2 = await page.evaluate(async () => { const g = document.querySelector(".table-grille"), r = g.getBoundingClientRect(), k = window.__app.stage.k, x = r.left + (16 + 52 + 5 * 64 + 32) * k, y = r.top + (16 + 52 + 7 * 64 + 32) * k, down = () => g.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y, bubbles: true }));
      await new Promise((res) => setTimeout(res, 200)); window.__said = []; down(); await new Promise((res) => setTimeout(res, 40)); down(); await new Promise((res) => setTimeout(res, 300)); return window.__said.length; });
    check(n2 === 1, `${T} · la même case touchée deux fois en 40 ms : une seule phrase (${n2})`);
    await resetSaid(page); await tapCell(page, 3, 3); await page.waitForTimeout(60); await tapCell(page, 9, 8); await page.waitForTimeout(900);
    check((await page.evaluate(() => window.__said.at(-1))) === "9 plus 8, 17." && (await page.evaluate(() => document.querySelector(".table-grille").dataset.case)) === "9+8", `${T} · deux cases à la suite : la dernière l'emporte`);
    if (big) await shot(page, "18-table-9+8");
    if (big) for (const [a, b, n] of [[7, 3, "cadre"], [3, 3, "reflet"], [3, 4, "double-plus-un"], [6, 2, "sauts"], [5, 3, "maison"], [8, 0, "plus-zero"], [10, 10, "dix-plus-dix"]]) {
      await tapCell(page, a, b); await page.waitForTimeout(700); await shot(page, `19-table-${a}+${b}-${n}`);
    }
    await tap(page, ".homekey", 900);
    check((await visible(page, ".leconskey")) === 1 && (await page.locator(".table-grille").count()) === 0 && (await visible(page, ".stars")) === 1, `${T} · la maison ramène la table à l'accueil (compteur d'étoiles revenu)`);
    check(!errors.length, `${T} · 4 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 5. la maison pendant une leçon du menu
  {
    const { page, context, errors } = await open();
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(300);
    await tap(page, '.lecons-tuile[data-key="L3"]'); await page.waitForSelector(".skip", { timeout: 15000 }); await page.waitForTimeout(800);
    await tap(page, ".homekey", 1500);
    check((await visible(page, ".leconskey")) === 1 && (await page.locator(".lecons-atoi").count()) === 0, `${T} · la maison pendant une leçon du menu : l'accueil, sans « À toi ! »`);
    await page.waitForTimeout(3000); check((await page.locator(".lecons-atoi").count()) === 0, `${T} · et rien ne revient ensuite`);
    check(!errors.length, `${T} · 5 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }

  // 6. L10 : le chalut plein, dix filets de dix poissons
  if (big) {
    const { page, context, errors } = await open("&lecon=L10");
    await tap(page, ".play");
    // (la voix de test est rapide : l'horloge et la voix sont arrêtées sur le chalut plein, le temps de la capture)
    await page.waitForFunction(() => { const ok = window.__app.lessons.p2?.st?.chalut === 10 || window.__lecon; if (ok) { window.__app.clock.pause(); window.__app.voice.pause(); } return ok; }, null, { timeout: 60000, polling: 20 }); await page.waitForTimeout(300);
    await shot(page, "20-L10-chalut");
    check(!errors.length, `${T} · 6 : aucune erreur (${errors.slice(0, 3).join(" | ")})`); await context.close();
  }
  writeFileSync(join(OUT, `${T}-phrases.json`), JSON.stringify(journal, null, 1));
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
