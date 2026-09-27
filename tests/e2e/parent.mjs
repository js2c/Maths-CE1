// PARCOURS DE L'ESPACE PARENT dans Chromium (tablette 1280 × 800, tactile). Remplit la base avec quatre
// semaines de séances inventées (réponses, niveaux, faits, trésor), puis :
//   un simple toucher sur le logo ne fait rien ; un appui long ouvre le code ; premier accès : choisir le
//   code, le confirmer (un second code différent est refusé) ; les quatre onglets ; le détail d'une séance ;
//   les exports CSV et JSON (contenu vérifié, code parent absent) ; fermer puis rouvrir avec un mauvais code,
//   puis le bon ; « code oublié » ; la durée de séance ; restaurer la sauvegarde après un effacement.
// Captures dans tests/e2e/out/parent.   node tests/e2e/parent.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/parent"));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true, acceptDownloads: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n, o = {}) => page.screenshot({ path: join(OUT, `${n}.png`), ...o });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const ready = () => page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });

await page.goto(url + "?nosw&voix=rapide"); await ready();
// ---------------------------------------------------------------- une base de quatre semaines
await page.evaluate(async () => {
  const st = window.__app.store, DAY = 86400000, now = Date.now();
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const day0 = new Date(now); day0.setHours(18, 10, 0, 0);
  const levels = [{ niveau: 1, date: day0 - 27 * DAY }, { niveau: 2, date: day0 - 22 * DAY }, { niveau: 3, date: day0 - 12 * DAY }, { niveau: 4, date: day0 - 3 * DAY }];
  const lvl = (t) => levels.filter((l) => l.date <= t).at(-1).niveau;
  const codes = ["E1", "E1", "E3", "E4", "E5", "autre"];
  for (let d = 27; d >= 1; d--) {
    if ([25, 21, 20, 14, 13, 7, 6].includes(d)) continue; // des jours sans séance (week-ends)
    const debut = day0 - d * DAY + Math.round(r() * 40) * 60000, stopped = d === 17, skill = Math.min(0.92, 0.55 + (27 - d) * 0.014);
    const s = { debut, terminee: !stopped, module: 1, questions: 0, justes: 0, etoiles: 0, etapes: [] };
    s.id = await st.add("seances", s);
    let t = debut + 40000;
    const n2 = stopped ? 4 : 6 + Math.floor(r() * 3), n1 = stopped ? 3 : 9 + Math.floor(r() * 2);
    for (let i = 0; i < n2; i++) { const a = 1 + Math.floor(r() * 7), b = 1 + Math.floor(r() * 2), ok = r() < skill + 0.05; t += 9000 + r() * 6000; await st.add("reponses", { t, seance: s.id, module: 2, niveau: 1, question: `${a} + ${b}`, forme: "directe", donnee: ok ? a + b : a + b + 1, attendue: a + b, juste: ok, tempsMs: 1800 + r() * 5000 * (1 - skill), ecoutes: 1, aide: r() < 0.1, erreur: ok ? null : "autre" }); s.questions++; if (ok) s.justes++; }
    for (let i = 0; i < n1; i++) {
      const n = lvl(t), ok = r() < skill, max = n <= 2 ? 10 : n === 3 ? 20 : 40, ans = n === 4 ? 30 + 1 + Math.floor(r() * 9) : 1 + Math.floor(r() * (max - 1)), code = ok ? null : codes[Math.floor(r() * codes.length)];
      const donnee = ok ? ans : code === "E1" ? ans + 1 : code === "E3" ? ans - 30 : code === "E5" ? Number(String(ans).split("").reverse().join("")) : ans + 2;
      t += 14000 + r() * 12000;
      await st.add("reponses", { t, seance: s.id, module: 1, niveau: n, question: `lire ${ans} sur la ligne ${n === 4 ? "30-40" : `0-${max}`} (pas 1)`, forme: i % 2 ? "placer" : "lire", donnee, attendue: ans, juste: ok, tempsMs: 3000 + r() * 9000 * (1.2 - skill), ecoutes: 1 + (r() < 0.2 ? 1 : 0), aide: false, erreur: code, revient: false, guide: i < 2 });
      s.questions++; if (ok) s.justes++;
    }
    s.fin = t + (stopped ? 0 : 70000); s.dureeS = Math.round((s.fin - s.debut) / 1000); s.reussite = +(s.justes / s.questions).toFixed(3); s.etoiles = s.justes + (stopped ? 0 : 10);
    s.etapes = stopped ? [{ id: "accueil", dureeS: 12 }, { id: "echauffement", dureeS: 70 }] : [{ id: "accueil", dureeS: 12 }, { id: "echauffement", dureeS: 110 }, { id: "notion", dureeS: 300 }, { id: "defi", sautee: "désactivée" }, { id: "probleme", sautee: "désactivée" }, { id: "recompense", dureeS: 64 }];
    if (d === 27) s.lecons = [{ id: "L1", raison: "niveau", vue: true, dureeS: 64 }];
    if (!stopped) s.cartes = d % 2 ? ["poisson-clown"] : [];
    await st.put("seances", s);
  }
  await st.put("niveaux", { module: 1, niveau: 4, obtenus: levels, redescentes: [], fenetre: [], vus: 3, taux: [0.8], lecons: ["L1", "L3"] });
  const facts = [["2+1", 1, 5], ["1+2", 1, 4], ["3+1", 1, 3], ["1+3", 1, 3], ["4+1", 1, 2], ["3+2", 1, 2], ["2+3", 1, 2], ["5+1", 1, 1], ["1+5", 1, 1], ["4+2", 1, 1], ["6+1", 1, 1], ["2+4", 1, 1], ["3+3", 2, 1]];
  for (const [fait, famille, boite] of facts) { const [a, b] = fait.split("+").map(Number); await st.put("faits", { fait, a, b, famille, boite, prochain: now + boite * DAY, historique: Array.from({ length: 6 - boite }, (_, i) => ({ t: now - i * DAY, juste: boite > 1 || i % 2 === 0, ms: 2500 })), tempsMedian: 2400 + boite * 100 }); }
  await st.setSetting("tempsDeBase", { mesures: [1800, 2100, 1900] }); await st.setSetting("mascotte", "Coralie");
  await st.put("recompenses", { id: "etoiles", total: 23, cumul: 612, dorees: 2, arcEnCiel: 3, coquillages: 14 });
  await st.put("recompenses", { id: "cartes", cartes: { "poisson-clown": { n: 2, premiere: now - 20 * DAY, brillante: false }, crabe: { n: 1, premiere: now - 9 * DAY }, hippocampe: { n: 1, premiere: now - 2 * DAY } } });
  await st.put("recompenses", { id: "serie", seances: 19, derniere: now - DAY });
});
await page.reload(); await ready();
await shot("1-accueil-logo");

// ---------------------------------------------------------------- l'appui long
const logo = await page.locator(".logo").boundingBox();
const cx = logo.x + logo.width / 2, cy = logo.y + logo.height / 2;
await page.mouse.move(cx, cy); await page.mouse.down(); await page.waitForTimeout(400); await page.mouse.up(); await page.waitForTimeout(2300);
check(!(await page.locator(".pa").count()), "un toucher bref sur le logo n'ouvre rien");
await page.mouse.down(); await page.waitForTimeout(1000); await shot("2-appui-long");
await page.waitForTimeout(1300); await page.mouse.up();
check(await page.locator(".pa-gate").isVisible(), "l'appui long ouvre le code");
const type = async (code) => { for (const d of code) await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForTimeout(250); };
await shot("3-choisir-le-code");
await type("2468"); await type("1357");
check((await page.locator(".pa-msg").textContent()).includes("différents"), "deux codes différents sont refusés");
await type("2468"); await type("2468");
await page.waitForSelector(".pa-sheet");
check(await page.evaluate(() => window.__app.stage.paused), "l'océan est en pause pendant la visite");
await page.waitForTimeout(300); await shot("4-calendrier");
// un jour du calendrier
await page.locator(".pa-day.has").last().click(); await page.waitForTimeout(700);
await shot("5-calendrier-jour", { fullPage: false });
// les séances
await page.tap('[data-tab="seances"]'); await page.waitForTimeout(200);
await shot("6-seances");
await page.locator(".pa-session > button").first().click(); await page.waitForTimeout(200);
await shot("7-seance-detail");
check(await page.locator(".pa-table tbody tr").count() > 10, "le détail d'une séance montre ses réponses");
// la progression
await page.tap('[data-tab="progression"]'); await page.waitForTimeout(300);
await shot("8-progression");
await page.locator(".pa-chart .hit").nth(2).dispatchEvent("pointerdown"); await page.waitForTimeout(100);
check((await page.locator(".pa-caption").first().textContent()).startsWith("Semaine du"), "toucher un point de la courbe raconte la semaine");
await page.locator(".pa-main").evaluate((m) => { m.scrollTop = 420; }); await page.waitForTimeout(150); await shot("9-progression-suite");
await page.locator(".pa-main").evaluate((m) => { m.scrollTop = m.scrollHeight; }); await page.waitForTimeout(150); await shot("10-progression-fin");
// données et réglages
await page.tap('[data-tab="donnees"]'); await page.waitForTimeout(300);
await shot("11-donnees");
const grab = async (sel) => { const [dl] = await Promise.all([page.waitForEvent("download"), page.locator(sel).click()]); const p = join(OUT, dl.suggestedFilename()); await dl.saveAs(p); return { name: dl.suggestedFilename(), text: readFileSync(p, "utf8") }; };
const csv = await grab('[data-export="reponses"]');
const lines = csv.text.replace(/^﻿/, "").trim().split("\r\n");
check(csv.text.startsWith("﻿") && lines[0].startsWith("réponse;séance;horodatage") && lines.length > 150, `CSV des réponses : ${csv.name}, ${lines.length - 1} lignes`);
const sess = await grab('[data-export="seances"]');
check(sess.text.split("\r\n").length > 15, `CSV des séances : ${sess.name}`);
const json = await grab('[data-export="json"]'), dump = JSON.parse(json.text);
check(dump.base === "ocean-des-nombres" && dump.seances.length >= 18 && dump.reponses.length > 200, `sauvegarde JSON : ${json.name}, ${dump.seances.length} séances, ${dump.reponses.length} réponses`);
check(!dump.reglages.some((r) => r.cle === "codeParent"), "le code parent n'est pas dans la sauvegarde");
check(!(await page.locator(".pa-reminder").count()), "plus de rappel d'export après la sauvegarde");
await page.locator('.pa-seg [data-v="10"]').click(); await page.waitForTimeout(150);
check(await page.evaluate(() => window.__app.store.setting("dureeSeanceMin")) === 10, "la durée de séance est enregistrée");
await page.locator(".pa-main").evaluate((m) => { m.scrollTop = m.scrollHeight; }); await page.waitForTimeout(150); await shot("12-reglages");
// lot 2 : difficulté proposée, défi record, point de départ
await page.locator('[aria-label="cran le plus dur"] [data-v="dur"]').click(); await page.waitForTimeout(150);
check(JSON.stringify(await page.evaluate(() => window.__app.store.setting("cransAutorises"))) === JSON.stringify({ min: "facile", max: "dur" }), "crans autorisés enregistrés");
await page.locator('[aria-label="défi record"] [data-v="non"]').click(); await page.waitForTimeout(150);
check((await page.evaluate(() => window.__app.store.setting("defiActif"))) === false, "défi record désactivable");
await page.locator('[aria-label="niveau de la ligne graduée"] [data-v="4"]').click(); await page.waitForTimeout(200);
check((await page.evaluate(async () => (await window.__app.store.get("niveaux", 1)).niveau)) === 4, "point de départ : niveau 4 de la ligne");
await page.locator(".pa-depart .pa-btn").first().click(); await page.waitForTimeout(300);
await page.locator(".pa-depart").scrollIntoViewIfNeeded(); await page.locator(".pa-main").evaluate((m) => { m.scrollTop -= 260; }); await page.waitForTimeout(150); await shot("12b-difficulte-point-de-depart");

// ---------------------------------------------------------------- fermer, rouvrir : mauvais code, bon code, code oublié
await page.tap(".pa-close"); await page.waitForTimeout(300);
check(!(await page.locator(".pa").count()) && !(await page.evaluate(() => window.__app.stage.paused)), "fermer rend l'océan");
const longPress = async () => { const b = await page.locator(".logo").boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(2300); await page.mouse.up(); await page.waitForSelector(".pa-gate"); };
await longPress();
await type("1111"); await page.waitForTimeout(300);
check((await page.locator(".pa-msg").textContent()).includes("pas le bon code") && !(await page.locator(".pa-sheet").count()), "un mauvais code est refusé");
await shot("13-mauvais-code");
await page.tap(".pa-link >> text=Code oublié ?");
const q = await page.locator(".pa-sub").textContent(), m = q.match(/(\d+) × (\d+) \+ (\d+)/);
await shot("14-code-oublie");
await type(String(Number(m[1]) * Number(m[2]) + Number(m[3]))); await page.tap('.pa-keys [data-key="ok"]'); await page.waitForTimeout(200);
check((await page.locator(".pa-sub").textContent()).startsWith("Choisissez"), "code oublié : la bonne opération permet de choisir un nouveau code");
await type("9753"); await type("9753"); await page.waitForSelector(".pa-sheet");
check(await page.evaluate(() => window.__app.store.setting("codeParent")) === "9753", "le nouveau code est enregistré");

// ---------------------------------------------------------------- tout effacer, puis restaurer
await page.tap('[data-tab="donnees"]');
await page.locator("button >> text=Tout effacer…").click();
await Promise.all([page.waitForEvent("load"), page.locator("button >> text=Oui, tout effacer").click()]); await ready();
check(await page.evaluate(async () => (await window.__app.store.all("seances")).length) === 0, "tout effacer vide la base");
await longPress(); await type("4321"); await type("4321"); await page.waitForSelector(".pa-sheet");
await page.tap('[data-tab="donnees"]');
await page.locator('input[type="file"]').setInputFiles(join(OUT, json.name)); await page.waitForSelector(".pa-confirm");
await shot("15-restaurer");
await page.locator("button >> text=Oui, restaurer").click(); await page.waitForTimeout(500);
const back = await page.evaluate(async () => ({ s: (await window.__app.store.all("seances")).length, r: (await window.__app.store.all("reponses")).length, code: await window.__app.store.setting("codeParent") }));
check(back.s === dump.seances.length && back.r === dump.reponses.length && back.code === "4321", `restauration : ${back.s} séances, ${back.r} réponses, code actuel gardé`);
await Promise.all([page.waitForEvent("load"), page.tap(".pa-close")]); await ready();

// ---------------------------------------------------------------- à 1920 × 1200
await Promise.all([page.waitForEvent("load"), page.setViewportSize({ width: 1920, height: 1200 })]); await ready();
await longPress(); await type("4321"); await page.waitForSelector(".pa-sheet"); await page.waitForTimeout(300);
await shot("16-calendrier-1920");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
