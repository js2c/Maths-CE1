// LOT « LES VOILIERS » (docs/SPEC.md, section 7 bis ; docs/LOTS.md, lot 2) : parcours du jeu des voiliers dans l'application.
// Chaque situation nouvelle, avec ses captures en 1280 × 800 et 1920 × 1200 (tests/e2e/out/voiliers) :
//  1. l'écran « choisir » : quatre exercices (lot « Les leçons »), les neuf niveaux des voiliers ;
//  2. base neuve, niveau 1, cran conseillé : l'exemple guidé, l'arrivée du bateau (la bulle : le nombre en chiffres et en
//     lettres, jamais sur le bateau), un bon passage (le doigt glisse le bateau), une erreur (la bouée allumée, l'explication,
//     le retour au calme), la deuxième erreur (le bateau va seul au bon passage), « je ne sais pas », la pause et la reprise ;
//  3. cran « plus dur » : le vent (annoncé ; il ne part qu'une fois le nombre dit ; il pousse le bateau dans un passage) ;
//  4. cran « très dur » : les pirates (rattrapent le bateau, qui coule) ;
//  5. niveau 9 : le double encadrement (la caméra recule, la rangée des dizaines) ;
//  6. ce qui est enregistré (codes V1, V2, NSP, rattrapé ; erreur corrigée) et la mascotte (placement, bulle) ;
//  7. « jouer » avec les voiliers imposés par le parent ; l'espace parent (le bloc des voiliers, le journal des erreurs) ;
//  8. l'entraînement libre (« Encore ! ») sur les voiliers, quitté par la maison.
//   node tests/e2e/voiliers.mjs [--out dossier] [--grand] (--grand : seulement 1920 × 1200)
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/voiliers"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TAILLES = args.includes("--grand") ? [[1920, 1200]] : [[1280, 800], [1920, 1200]];
const open = async (q, [w, h], prep = null) => {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { page, context, errors };
};
const etat = (page) => page.evaluate(() => window.__app.voiliers?.api?.etat() ?? null);
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const clearSaid = (page) => page.evaluate(() => { window.__said.length = 0; window.__vu = 0; });
// un bateau attend le geste de l'enfant
const waitBoat = (page, t = 60000) => page.waitForFunction(() => window.__app.voiliers?.attend, null, { timeout: t, polling: 50 });
const question = (page) => page.evaluate(() => { const q = window.__app.voiliers.q; return { num: q.num, k: q.k, bouees: q.bouees, mer: q.mer, double: q.double, k2: q.k2, rangee2: q.rangee2 }; });
// le doigt (la souris) prend le bateau et le lâche dans le passage c
const drag = async (page, c, [w]) => {
  const s = await etat(page), k = w / 1280, x = await page.evaluate((c) => window.__app.voiliers.api.centre(c), c);
  await page.mouse.move(s.x * k, (s.y - 60) * k); await page.mouse.down();
  for (let i = 1; i <= 8; i++) { await page.mouse.move((s.x + (x - s.x) * i / 8) * k, (s.y - 60 + (s.LINE_Y - 10 - s.y + 60) * i / 8) * k); await page.waitForTimeout(30); }
  await page.mouse.up();
};
const deposer = (page, c) => page.evaluate((c) => window.__app.voiliers.api.deposer(c), c);
// la bulle ne couvre jamais le bateau qui attend (ni la bande des bouées)
const bulleLibre = (page) => page.evaluate(() => {
  const b = window.__app.bulle.etat(), z = window.__app.voiliers.api.zoneBateau();
  if (!b.visible || !b.rect || !z) return { ok: true, b };
  const r = b.rect, sur = !(r[2] < z[0] || r[0] > z[2] || r[3] < z[1] || r[1] > z[3]) || r[3] > 600;
  return { ok: !sur, b, z };
});
// chaque capture, avec ce que la voix a dit depuis la précédente et ce qu'écrit la bulle (pour la relecture du lot)
const releve = [];
const shot = async (page, n, [w]) => {
  await page.screenshot({ path: join(OUT, `${n}-${w}.png`) });
  const x = await page.evaluate(() => { const d = window.__said ?? [], b = window.__app.bulle?.etat?.(); const r = { dit: d.slice(window.__vu ?? 0), bulle: b?.visible ? b.texte : null }; window.__vu = d.length; return r; }).catch(() => ({}));
  releve.push({ capture: `${n}-${w}.png`, ...x });
};

for (const T of TAILLES) {
  console.log(`\n# ${T[0]} × ${T[1]}`);
  // 1. l'écran « choisir »
  {
    const { page, context, errors } = await open("", T);
    await page.tap(".choisir", { force: true });
    await page.waitForSelector(".choix-ex", { timeout: 20000 }); await page.waitForTimeout(600);
    const ex = await page.$$eval(".choix-ex", (b) => b.map((x) => { const r = x.getBoundingClientRect(); return { k: x.dataset.key, l: r.left, r: r.right }; }));
    check(ex.map((e) => e.k).join() === "ligne,additions,calcul,voiliers" && ex.every((e) => e.l >= 0 && e.r <= T[0]), `« choisir » : quatre exercices dans l'écran (${ex.map((e) => e.k).join(", ")})`);
    await shot(page, "01-choisir", T);
    await page.tap('.choix-ex[data-key="voiliers"]', { force: true }); await page.waitForTimeout(900);
    const tuiles = await page.$$eval(".choix-tuile", (b) => b.map((x) => x.dataset.key));
    check(tuiles.length === 9, `les voiliers : neuf niveaux (${tuiles.join(" ")})`);
    await shot(page, "02-choisir-niveaux", T);
    // la légende (le petit livre) : une ligne par niveau, avec la vignette des voiliers
    await page.tap(".legende", { force: true }); await page.waitForTimeout(700);
    const leg = await page.evaluate(() => ({ ouverte: !!window.__app.legendOpen, n: window.__app.legendes?.voiliers?.length ?? 0 }));
    check(leg.ouverte && leg.n === 9, `la légende des voiliers s'ouvre, neuf lignes (${JSON.stringify(leg)})`);
    await shot(page, "02b-legende", T);
    await page.tap(".legende-fermer", { force: true }); await page.waitForTimeout(500);
    check(!(await page.evaluate(() => window.__app.legendOpen)), "la croix ferme la légende");
    await page.tap('.choix-tuile[data-key="2"]', { force: true });
    await page.waitForFunction(() => window.__app.session?.rec?.module === 4, null, { timeout: 20000 });
    check(true, "un niveau des voiliers touché : la séance du jour sur les voiliers");
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 2. base neuve, niveau 1, cran conseillé
  {
    const { page, context, errors } = await open("&cran=conseille&choix=4:1", T);
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.voiliers?.api?.etat().mode === "auto", null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(150); await shot(page, "03-exemple-guide", T);
    check(/Regarde : 36 est plus grand que 30/.test(await said(page)), "l'exemple guidé du niveau 1 : la voix explique, le bateau va seul");
    await waitBoat(page); await page.waitForTimeout(100);
    let q = await question(page), s = await etat(page);
    check(s.x === 880 && s.mode === "wait", `au calme, le bateau attend à droite du centre (${Math.round(s.x)}, ${Math.round(s.y)})`);
    await page.evaluate((n) => window.__app.voice.say(String(n)), q.num); await page.waitForTimeout(250);
    const bl = await bulleLibre(page);
    check(bl.ok && /«/.test(bl.b.texte ?? ""), `la bulle écrit le nombre en lettres et ne couvre pas le bateau (« ${bl.b.texte} », place ${bl.b.place})`);
    await shot(page, "04-arrivee-bulle", T);
    // un bon passage, au doigt
    await clearSaid(page);
    await drag(page, q.k, T); await page.waitForTimeout(250);
    await shot(page, "05-bon-passage", T);
    check(/C'est entre|Bravo|Super|Oui|Bien joué|Exactement/.test(await said(page)), `bon passage : ${await said(page)}`);
    // une erreur au calme : la bouée s'allume, la voix explique, le bateau revient
    await waitBoat(page); q = await question(page); await clearSaid(page);
    const faux = q.k === 0 ? 2 : 0;
    await deposer(page, faux);
    await page.waitForFunction(() => window.__app.voiliers.api.etat().allumees.some((x) => x > 0), null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(200); await shot(page, "06-erreur-calme", T);
    check(/Il est plus (grand|petit) que/.test(await said(page)), `erreur : ${await said(page)}`);
    // la deuxième erreur : le bateau va seul au bon passage
    await waitBoat(page); await clearSaid(page);
    await deposer(page, faux);
    await page.waitForFunction(() => window.__app.voiliers.api.etat().mode === "auto", null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(200); await shot(page, "07-deuxieme-erreur", T);
    // « je ne sais pas »
    await waitBoat(page); await clearSaid(page);
    await page.tap(".voiliers-nsp", { force: true });
    await page.waitForFunction(() => window.__app.voiliers.api.etat().mode === "auto", null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(150); await shot(page, "08-je-ne-sais-pas", T);
    check(/Ce n'est pas grave, regardons ensemble/.test(await said(page)), `« je ne sais pas » : ${await said(page)}`);
    // la pause (la maison) et la reprise : la scène s'arrête, la consigne est redite
    await waitBoat(page); await page.waitForTimeout(300);
    const avant = await etat(page);
    await page.tap(".session-home", { force: true }); await page.waitForTimeout(1500);
    const pendant = await etat(page);
    check(pendant.mode === avant.mode && Math.abs(pendant.x - avant.x) < 1, "pendant la pause, le bateau ne bouge pas");
    await shot(page, "09-pause", T);
    await clearSaid(page);
    await page.tap(".play.keep", { force: true }); await page.waitForTimeout(600);
    check(/On continue/.test(await said(page)) && /bon passage/.test(await said(page)), `reprise : ${await said(page)}`);
    await waitBoat(page); q = await question(page); await deposer(page, q.k); await page.waitForTimeout(400);
    // ce qui est enregistré
    const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 4));
    check(rep[0]?.forme === "exemple" && rep.some((r) => r.juste) && rep.some((r) => r.erreur === "V1" || r.erreur === "V2") && rep.some((r) => r.erreur === "NSP"), `réponses enregistrées : ${rep.map((r) => `${r.question} [${r.donnee ?? "-"}] ${r.juste ? "juste" : r.erreur}`).join(" ; ")}`);
    const fondus = await page.evaluate(() => (window.__journalMascotte ?? []).filter((x) => x.genre === "force").length);
    check(fondus <= 3, `mascotte : ${fondus} fondu(s) forcé(s)`);
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 3. le vent (cran « plus dur ») : annoncé, il ne part qu'une fois le nombre dit, il pousse le bateau dans un passage
  {
    const { page, context, errors } = await open("&cran=dur&choix=4:3", T, async () => { const st = { module: 4, niveau: 3, obtenus: [{ niveau: 1, date: 0 }], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [1, 2, 3] }; await window.__app.store.put("niveaux", st); });
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.voiliers?.api?.etat().mode === "enter", null, { timeout: 60000, polling: 50 });
    // (le bateau arrive au-dessus d'un mauvais passage, puis le vent attend la fin du nombre dit)
    await page.waitForFunction(() => ["tenu", "wait"].includes(window.__app.voiliers.api.etat().mode), null, { timeout: 20000, polling: 20 });
    const y0 = (await etat(page)).y;
    check(/Le vent se lève/.test(await said(page)) && Math.abs(y0 - 405) < 30, `le vent est annoncé, le bateau s'arrête en haut (${Math.round(y0)}) : ${await said(page)}`);
    await waitBoat(page);
    await page.waitForFunction(() => window.__app.voiliers.api.etat().y > 500, null, { timeout: 60000, polling: 50 });
    await shot(page, "10-vent", T);
    const q = await question(page);
    // le vent pousse le bateau jusqu'aux bouées, sans toucher : il passe ou non selon le passage où il arrive
    await page.waitForFunction(() => !window.__app.voiliers.attend, null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(300); await shot(page, "11-vent-arrive", T);
    const s = await said(page);
    check(/Le vent repousse le bateau|C'est entre|Bravo|Super|Oui|Bien joué|Exactement/.test(s), `le vent a mené le bateau aux bouées (${q.num}) : ${s.slice(-160)}`);
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 4. les pirates (cran « très dur ») : rattrapé, le bateau coule
  {
    const { page, context, errors } = await open("&cran=tresdur&choix=4:1", T, async () => { await window.__app.store.put("niveaux", { module: 4, niveau: 1, obtenus: [{ niveau: 1, date: 0 }], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [1] }); });
    await page.tap(".play", { force: true });
    await waitBoat(page);
    check(/Attention, des pirates/.test(await said(page)), "les pirates sont annoncés");
    await page.waitForFunction(() => window.__app.voiliers.api.etat().pirates === "chase", null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(2500); await shot(page, "12-pirates", T);
    await page.waitForFunction(() => window.__app.voiliers.api.etat().mode === "sink", null, { timeout: 60000, polling: 50 });
    await page.waitForTimeout(900); await shot(page, "13-pirates-coule", T);
    check(/Les pirates ont rattrapé le bateau/.test(await said(page)), "rattrapé : la voix le dit, le bateau coule");
    await waitBoat(page);
    const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 4));
    check(rep.some((r) => r.erreur === "rattrape" && !r.juste), `enregistré : rattrapé (${rep.map((r) => r.erreur).join(", ")})`);
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 5. le double encadrement (niveau 9)
  {
    const { page, context, errors } = await open("&cran=conseille&choix=4:9", T, async () => { await window.__app.store.put("niveaux", { module: 4, niveau: 9, obtenus: [{ niveau: 1, date: 0 }], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [9] }); });
    await page.tap(".play", { force: true });
    await waitBoat(page); const q = await question(page);
    check(q.double && q.bouees.length === 4, `niveau 9 : quatre bouées de 100 en 100 (${q.bouees.join(" ")}), ${q.num}`);
    await shot(page, "14-double-centaines", T);
    await deposer(page, q.k);
    await page.waitForFunction(() => window.__app.voiliers.api.etat().ZC > 5, null, { timeout: 60000, polling: 50 });
    await shot(page, "15-double-recul", T);
    await waitBoat(page); await page.waitForTimeout(300);
    const s = await etat(page);
    check(s.rangee === 2 && s.bouees.length === 5 && /Et maintenant, entre quelles dizaines/.test(await said(page)), `la rangée des dizaines (${s.bouees.join(" ")}) : « Et maintenant, entre quelles dizaines ? »`);
    await shot(page, "16-double-dizaines", T);
    await deposer(page, q.k2); await page.waitForTimeout(500);
    check(/C'est entre \d+0 et \d+0 !/.test(await said(page)), "les deux rangées justes : « C'est entre … et … ! »");
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}
// 7. « jouer » : les voiliers imposés par le parent (ils ne tournent pas d'eux-mêmes) ; l'espace parent
{
  const T = TAILLES[0];
  const { page, context, errors } = await open("&cran=conseille", T, async () => { await window.__app.store.setSetting("moduleImpose", { module: 4, t: Date.now() }); });
  await page.tap(".play", { force: true }); await waitBoat(page);
  check(await page.evaluate(() => window.__app.session.rec.module === 4 && window.__app.frieze.icon === "frise.voiliers"), "module imposé : les voiliers, pictogramme du voilier dans la frise");
  await shot(page, "17-jouer-impose", T);
  for (let i = 0; i < 3; i++) { await waitBoat(page); const q = await question(page); await deposer(page, i === 1 ? (q.k === 0 ? 1 : 0) : q.k); await page.waitForTimeout(300); }
  await waitBoat(page);
  await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
  page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(700);
  const card = await page.evaluate(() => [...document.querySelectorAll(".pa-card-box")].map((b) => b.textContent).find((t) => t.includes("Module 4")) ?? "");
  check(/Les voiliers/.test(card) && /Niveau atteint : 1 sur 9/.test(card), `espace parent : le bloc « Les voiliers » (${card.slice(0, 120)})`);
  await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].find((h) => h.textContent.includes("Module 4"))?.scrollIntoView()); await page.waitForTimeout(300); await shot(page, "18-parent-voiliers", T);
  const journal = await page.evaluate(() => document.body.textContent);
  check(/voiliers/.test(journal) && /(a confondu plus grand et plus petit|s'est trompée de plusieurs passages)/.test(journal), "journal des erreurs : l'erreur des voiliers en une phrase");
  await page.evaluate(() => { const el = [...document.querySelectorAll(".pa-main *")].filter((e) => !e.children.length).find((e) => /a confondu plus grand et plus petit|s'est trompée de plusieurs passages/.test(e.textContent)); el?.scrollIntoView({ block: "center" }); }); await page.waitForTimeout(300); await shot(page, "18b-parent-journal", T);
  await page.click('[data-tab="donnees"]'); await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelector('[aria-label="niveau des voiliers"]')?.scrollIntoView({ block: "center" })); await page.waitForTimeout(200);
  await page.click('[aria-label="niveau des voiliers"] button[data-v="5"]'); await page.waitForTimeout(500);
  const dep = await page.evaluate(async () => ({ msg: document.body.textContent.includes("Voiliers : niveau 5 à la prochaine partie."), niveau: (await window.__app.store.all("niveaux")).find((n) => n.module === 4)?.niveau }));
  check(dep.msg && dep.niveau === 5, `point de départ : le parent met les voiliers au niveau 5 (${JSON.stringify(dep)})`);
  await shot(page, "18c-parent-point-de-depart", T);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 8. l'entraînement libre (« Encore ! ») : les voiliers au niveau choisi, sans étoiles ; la maison les quitte, le lagon revient
{
  const T = TAILLES[0];
  const { page, context, errors } = await open("", T, async () => { const n = Date.now(); await window.__app.store.add("seances", { debut: n - 600000, fin: n, terminee: true, module: 1, etapes: [] }); });
  await page.waitForSelector(".again"); await page.tap(".again", { force: true });
  await page.waitForSelector(".choix-ex", { timeout: 15000 }); await page.waitForTimeout(400);
  await page.tap('.choix-ex[data-key="voiliers"]', { force: true }); await page.waitForTimeout(700);
  await page.tap('.choix-tuile[data-key="3"]', { force: true });
  await page.waitForSelector(".cran", { timeout: 15000 }); await page.waitForTimeout(400);
  await shot(page, "19a-crans", T);
  await page.tap(".cran", { force: true }).catch(() => {});
  await waitBoat(page); const q = await question(page);
  const etoiles0 = await page.evaluate(() => window.__app.rewards.total);
  await deposer(page, q.k); await waitBoat(page);
  const libre = await page.evaluate(async () => { const r = (await window.__app.store.all("reponses")).filter((x) => x.module === 4); return { libre: r.every((x) => x.libre), n: r.length, etoiles: window.__app.rewards.total }; });
  check(libre.n >= 1 && libre.libre && libre.etoiles === etoiles0, `entraînement libre : réponses marquées « libre », sans étoiles (${JSON.stringify(libre)})`);
  await shot(page, "19-encore-voiliers", T);
  await page.tap(".session-home", { force: true }); await page.waitForTimeout(1200);
  const apres = await page.evaluate(() => ({ canvas: document.querySelectorAll("canvas.voiliers").length, scene: !!window.__app.voiliers.api, again: !!document.querySelector(".again") }));
  check(!apres.canvas && !apres.scene && apres.again, `la maison quitte les voiliers : la scène s'en va, retour à l'accueil (${JSON.stringify(apres)})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
writeFileSync(join(OUT, "parcours-resultat.json"), JSON.stringify({ echecs: fail, captures: releve }, null, 1));
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nparcours voiliers : tout est vert");
await browser.close(); srv.close();
process.exit(fail.length ? 1 : 0);
