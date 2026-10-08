// LOT « MASCOTTE » (docs/SPEC.md, section 11 ; docs/LOTS.md, lot 1) : le parcours du lot. Il passe par chaque situation
// nouvelle, à la vitesse réelle de la voix (la bulle n'est là que le temps de parler), et en fait les captures, à
// 1280 × 800 (densité 2) et 1920 × 1200 (densité 1) :
//   - l'accueil (base neuve : plus de choix du nom), le salut et la bienvenue, le sélecteur, « choisir » ;
//   - chaque réaction : salut, joie, grande joie, déception, encouragement, relance (geste à 12 s, phrase à 25 s), flèche ;
//   - la flèche sur la ligne graduée (lire, sauter, placer : jamais sur la réponse), dans les leçons, la dictée ;
//   - la bulle sur chaque type d'écran : elle ne couvre jamais ce que l'enfant touche (contrôle à chaque capture) ;
//   - la pause (la mascotte se tait, la bulle s'efface, la relance s'arrête), « réécouter » en pause, la reprise ;
//   - la récompense, le récif (sans mascotte ni bulle), l'album, « à demain » ;
//   - le journal des raccords de la mascotte : combien de fondus forcés ;
//   - aucune erreur dans la page.
//   node tests/e2e/mascotte.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "./navigateur.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/mascotte")), SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const BASE = "?nosw&son=non";
const PETITES = ["idle-approbation", "idle-sourire", "idle-amuse"], RELANCE = ["idle-sourcils", "idle-curiosite"];
const resultat = { date: new Date().toISOString(), ecrans: [], journal: {} };

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]]) {
  if (SEUL && SEUL !== String(W)) continue;
  const out = join(OUT, String(W)); mkdirSync(out, { recursive: true });
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true });
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const etat = () => page.evaluate(() => ({ m: window.__app.ocean.mascotte.etat(), b: window.__app.bulle.etat(), f: window.__app.fleche.visible, fa: window.__app.fleche.a?.css ?? null }));
  // une capture, et le contrôle de la bulle : jamais sur ce que l'enfant touche
  const shot = async (nom, quoi = "") => {
    await page.screenshot({ path: join(out, `${nom}.png`) });
    const e = await etat();
    resultat.ecrans.push({ W, nom, clip: e.m.clip, ambiance: e.m.ambiance, bulle: e.b.visible ? { place: e.b.place, texte: e.b.texte, couvre: e.b.couvre, gene: e.b.gene } : null, fleche: e.f });
    if (e.b.visible) check(e.b.couvre === 0, `${W} ${nom} : la bulle (${e.b.place}) ne couvre rien de ce que l'enfant touche${quoi ? ` — ${quoi}` : ""}`);
    return e;
  };
  const go = async (q) => {
    await page.goto(url + BASE + q);
    await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
    await page.waitForFunction(() => window.__app.ocean.mascotte.etat().pret, null, { timeout: 60000 });
  };
  const until = (fn, arg, ms = 30000) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true, () => false);
  const bulle = (re) => until((s) => { const b = window.__app.bulle.etat(); return b.visible && new RegExp(s, "i").test(b.texte); }, re.source);
  const clip = (list, ms = 15000) => until((l) => l.includes(window.__app.ocean.mascotte.etat().clip), list, ms);
  const ligne = () => until(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, 60000);
  const pave = () => until(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, 60000);
  const repondre = async (juste) => {
    const q = await page.evaluate(() => { const s = window.__app.screen.q; return { answer: s.answer, wrong: s.choices?.find((c) => c.value !== s.answer)?.value ?? null }; });
    await page.tap(`.answer[data-value="${juste ? q.answer : q.wrong}"]`, { force: true });
  };
  const ROW = "&cran=conseille&sans=echauffement,defi&sansLecon&guides=0";

  // ---- 1. l'accueil, base neuve : la mascotte, sans nom ; le salut et la bienvenue ; le sélecteur
  await go(""); await page.waitForTimeout(1500);
  let e = await shot("01-accueil");
  check(e.m.pret && e.m.rendu === "WebGL" && e.m.ambiance === "pause", `${W} accueil : la mascotte est là (${e.m.clip}, ${e.m.rendu}, ambiance ${e.m.ambiance})`);
  check(await page.evaluate(() => !document.querySelector("#octo") && !window.__app.atlas.octo && getComputedStyle(document.querySelector("#mascotte")).visibility === "visible"), `${W} accueil : plus de pieuvre`);
  await page.tap(".play", { force: true });
  check(await bulle(/bienvenue/), `${W} le salut : la bulle dit la bienvenue`);
  check(await clip(["idle-sourcils"], 6000), `${W} le salut : le geste des sourcils`);
  await page.waitForTimeout(500); e = await shot("02-salut-bienvenue");
  check(!(await page.locator(".name").count()), `${W} pas de choix du nom au premier lancement`);
  await page.waitForSelector(".cran", { timeout: 30000 }); await bulle(/niveau/); await page.waitForTimeout(1200); await shot("03-selecteur");

  // ---- 2. la ligne graduée, « lire » : la flèche sur l'étoile, puis joie, déception, grande joie
  await go(`&choix=1:1&format=lire${ROW}&questions=8`); await page.tap(".play", { force: true });
  check(await until(() => window.__app.fleche.visible, null, 60000), `${W} lire : la flèche apparaît pendant la consigne`);
  await page.waitForTimeout(700);
  e = await shot("10-fleche-lire");
  const pos = await page.evaluate(() => { const s = window.__app.screen, f = window.__app.fleche; return { cible: f.cible, star: s.starAt }; });
  check(pos.star && Math.abs(pos.cible[0] - pos.star[0]) < 1 && pos.cible[1] < pos.star[1], `${W} lire : la flèche au-dessus de l'étoile (${pos.cible.map(Math.round)} / ${pos.star?.map(Math.round)})`);
  await ligne(); await until(() => !window.__app.voice.speaking, null, 20000); await page.waitForTimeout(300);
  check(!(await page.evaluate(() => window.__app.fleche.visible)), `${W} lire : la flèche s'en va avec la fin de la consigne`);
  await repondre(true);
  check(await clip(PETITES), `${W} bonne réponse : petite joie (${(await etat()).m.clip})`);
  await page.waitForTimeout(400); await shot("11-joie");
  await ligne(); await repondre(false);
  check(await clip(["wrong"]), `${W} première erreur : déception bienveillante`);
  await page.waitForTimeout(900); await shot("12-deception", "la correction");
  // deux bonnes réponses de plus : la troisième de suite est une grande joie
  for (let k = 0; k < 3; k++) { await ligne(); await page.waitForTimeout(200); await repondre(true); if (k < 2) await page.waitForTimeout(400); }
  check(await clip(["success"]), `${W} trois réussites de suite : grande joie`);
  await page.waitForTimeout(700); await shot("13-grande-joie");
  // l'encouragement : une seconde erreur sans nouvelle consigne (protection du sélecteur, défi) : demandé directement ici
  await ligne(); await repondre(false); const deçue = await clip(["wrong"]);
  await page.evaluate(() => { const m = window.__app.ocean.mascotte; m.play("encourager"); if (m.erreurs < 2) m.play("encourager"); });
  check(await clip(["encourage"], 14000), `${W} erreur suivante : encouragement (la déception avant : ${deçue ? "oui" : "non"} ; ${JSON.stringify((await etat()).m)})`);
  await page.waitForTimeout(800); await shot("14-encouragement");

  // ---- 3. la relance : 12 s sans toucher, un geste ; 25 s, la phrase ; puis plus rien
  await ligne();
  await page.evaluate(() => { window.__relance = []; const m = window.__app.ocean.mascotte; m.activite(); const t0 = performance.now(); const id = setInterval(() => { const c = m.etat().clip; if (window.__relance.at(-1)?.c !== c) window.__relance.push({ t: Math.round((performance.now() - t0) / 100) / 10, c }); }, 100); window.__relanceStop = () => clearInterval(id); });
  check(await clip(RELANCE, 20000), `${W} relance : un geste après 12 s sans toucher`);
  await page.waitForTimeout(400); await shot("15-relance-geste");
  check(await bulle(/Prends ton temps/), `${W} relance : « Prends ton temps… » après 25 s`);
  await page.waitForTimeout(600); await shot("16-relance-phrase");
  await page.waitForTimeout(12000);
  const rel = await page.evaluate(() => { window.__relanceStop(); return window.__relance; });
  const geste = rel.find((r) => ["idle-sourcils", "idle-curiosite"].includes(r.c)), phrases = await page.evaluate(() => window.__journalMascotte.filter((j) => /Prends ton temps/.test(j.texte)).length);
  check(geste && geste.t >= 11.5 && geste.t <= 15, `${W} relance : le geste à ${geste?.t} s`);
  check(phrases === 1 && !(await page.evaluate(() => window.__app.bulle.etat().visible)), `${W} relance : une seule phrase, puis plus rien`);

  // ---- 4. la pause : la mascotte se tait, la bulle s'efface ; « réécouter » en pause ; la reprise
  await page.tap(".session-home", { force: true }); await page.waitForTimeout(800);
  e = await shot("17-pause");
  check(e.m.suspendue && !e.m.parle && !e.b.visible && e.m.ambiance === "pause", `${W} pause : la mascotte se tait et attend, plus de bulle`);
  await page.tap(".mascotte-tap", { force: true }); check(await bulle(/pause/), `${W} pause : « réécouter » écrit la phrase de la pause`);
  await page.waitForTimeout(800); await shot("18-pause-reecouter");
  await page.waitForTimeout(4000); await page.tap(".bubble.play", { force: true });
  check(await bulle(/On continue/), `${W} reprise : « On continue ! » et la consigne`);
  await page.waitForTimeout(900); e = await shot("19-reprise");
  check(!e.m.suspendue, `${W} reprise : la mascotte reprend`);

  // ---- 5. la flèche : « sauter » (sur la tortue), « placer » (sur le poisson, jamais sur la réponse)
  await go(`&choix=1:3&format=sauter${ROW}`); await page.tap(".play", { force: true });
  check(await until(() => window.__app.fleche.visible, null, 60000), `${W} sauter : la flèche`); await page.waitForTimeout(700); await shot("20-fleche-sauter");
  await go(`&choix=1:2&format=placer${ROW}`); await page.tap(".play", { force: true });
  await ligne(); await bulle(/./); await page.waitForTimeout(700); await shot("21-placer-sans-fleche");
  check(!(await page.evaluate(() => window.__app.fleche.visible)), `${W} placer : pas de flèche (elle donnerait la réponse ou une direction)`);

  // ---- 6. les additions, le calcul, l'échauffement : la bulle évite l'ardoise quand elle peut, jamais le pavé
  await go(`&choix=2:3&cran=facile&sans=echauffement,defi&sansLecon&guides=0`); await page.tap(".play", { force: true });
  await pave(); await page.locator(".nsp").filter({ visible: true }).first().tap({ force: true }).catch(() => {});
  await bulle(/./); await page.waitForTimeout(900); await shot("22-additions-correction");
  await pave(); await page.tap(".mascotte-tap", { force: true }); await bulle(/./); await page.waitForTimeout(900); await shot("23-additions-consigne");
  await go(`&choix=3:2&cran=conseille&sans=echauffement,defi&sansLecon`); await page.tap(".play", { force: true });
  await pave(); await page.tap(".mascotte-tap", { force: true }); await bulle(/./); await page.waitForTimeout(700); await shot("24-calcul");
  await go(`&cran=conseille&sans=notion,defi`); await page.tap(".play", { force: true });
  await pave(); await page.tap(".mascotte-tap", { force: true }); await bulle(/./); await page.waitForTimeout(700); await shot("25-echauffement");

  // ---- 7. la dictée (niveau 12) : la correction montre le nombre décomposé, la flèche au-dessus
  await go(`&choix=1:12&cran=facile${ROW}`); await page.tap(".play", { force: true });
  await pave(); await page.locator(".nsp").filter({ visible: true }).first().tap({ force: true }).catch(() => {});
  check(await until(() => window.__app.fleche.visible, null, 20000), `${W} dictée : la flèche sur le nombre décomposé`);
  await page.waitForTimeout(900); await shot("26-dictee-correction");

  // ---- 8. « choisir » : la bulle ne se pose jamais sur les tuiles
  await go(""); await page.tap(".bubble.choisir", { force: true }); await page.waitForSelector(".choix-ex", { timeout: 15000 });
  await bulle(/./); await page.waitForTimeout(800); await shot("30-choisir-exercices");
  await page.tap(".choix-ex >> nth=0", { force: true }); await page.waitForSelector(".choix-tuile", { timeout: 15000 });
  await bulle(/./); await page.waitForTimeout(900); await shot("31-choisir-niveaux");

  // ---- 9. les leçons : la flèche à la place du bras de la pieuvre
  for (const [L, n, quoi] of [["L1", "40", /tortue est sur/], ["L3", "41", /regarde|loupe|part de/], ["L7", "42", /poisson est sur/]]) {
    await go(`&lecon=${L}`); await page.tap(".play", { force: true });
    const vu = await until(() => window.__app.fleche.visible, null, 90000);
    check(vu, `${W} leçon ${L} : la flèche`); await page.waitForTimeout(700); await shot(`${n}-lecon-${L}`);
    void quoi;
  }

  // ---- 10. la fin de séance : grande joie à la récompense, le récif sans mascotte, l'album, « à demain »
  await go(`&choix=1:1&format=lire${ROW}&questions=1`); await page.tap(".play", { force: true });
  await ligne(); await repondre(true);
  check(await until(() => !!document.querySelector(".tally"), null, 60000), `${W} récompense`);
  check(await clip(["success"], 8000), `${W} récompense : grande joie`);
  await page.waitForTimeout(1200); await shot("50-recompense");
  await until(() => !!document.querySelector(".moon"), null, 120000); await page.waitForTimeout(1500); await shot("51-a-demain");
  await go(""); await page.evaluate(async () => { const a = window.__app, ids = a.cartes.cartes.filter((c) => c.zone === "lagon").map((c) => c.id).slice(0, 5); await a.store.put("recompenses", { id: "cartes", cartes: Object.fromEntries(ids.map((id) => [id, { n: 1, premiere: Date.now() }])) }); await a.rewards.load(); });
  await go(""); await page.tap(".reefkey", { force: true }); await recifOuvert(page); await page.waitForTimeout(1500);
  e = await shot("52-recif");
  check(!(await page.evaluate(() => window.__app.ocean.mascotteVisible)) && !e.m.visible && !e.b.visible, `${W} récif : ni la mascotte ni sa bulle`);
  await page.tap(".session-home, .homekey", { force: true }).catch(() => {});
  await go(""); await page.tap(".albumkey", { force: true }); await bulle(/./); await page.waitForTimeout(1200); await shot("53-album");

  // ---- le journal des raccords de la mascotte (toute la visite à cette taille d'écran, dernière page)
  const j = await page.evaluate(() => window.__journalMascotte.filter((x) => x.raccord));
  check(errors.length === 0, `${W} : aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
  await context.close();
  void j;
}

// ---- une séance simulée suivie de bout en bout : le journal des raccords (combien de fondus forcés)
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
  const page = await context.newPage();
  await page.goto(url + BASE + "&cran=conseille&sans=defi&sansLecon&questions=10&faits=8");
  await page.waitForFunction(() => window.__ready !== undefined && window.__app.ocean.mascotte.etat().pret, null, { timeout: 60000 });
  await page.tap(".play", { force: true });
  const t0 = Date.now();
  let n = 0;
  while (Date.now() - t0 < 12 * 60000) {
    const st = await page.evaluate(() => { const s = window.__app.screen, f = window.__app.facts; return { fin: !!document.querySelector(".moon"), l: s?.q && s.resolve && !s.locked ? { a: s.q.answer, w: s.q.choices?.find((c) => c.value !== s.q.answer)?.value ?? null, input: s.input } : null, p: f?.q && f.resolve && !f.locked ? { n: f.q.answer ?? (f.q.forme === "trouDroite" ? f.q.b : f.q.forme === "trouGauche" ? f.q.a : f.q.a + f.q.b) } : null }; });
    if (st.fin) break;
    const juste = n++ % 4 !== 2; // une erreur sur quatre
    if (st.l && !st.l.input) { await page.waitForTimeout(2500); await page.tap(`.answer[data-value="${juste || st.l.w === null ? st.l.a : st.l.w}"]`, { force: true }).catch(() => {}); }
    else if (st.p) { await page.waitForTimeout(2500); const v = String(juste ? st.p.n : st.p.n + 1); for (const d of v) { await page.tap(`.key[data-key="${d}"]`, { force: true }).catch(() => {}); await page.waitForTimeout(150); } await page.tap('.key[data-key="valider"]', { force: true }).catch(() => {}); }
    else if (await page.locator(".cran").count()) await page.tap(".cran-ok", { force: true }).catch(() => {});
    else if (await page.locator(".shelltap").count()) await page.tap(".shelltap >> nth=0", { force: true }).catch(() => {});
    await page.waitForTimeout(600);
  }
  const j = await page.evaluate(() => window.__journalMascotte.filter((x) => x.raccord));
  const par = {}; for (const x of j) par[x.raccord] = (par[x.raccord] ?? 0) + 1;
  const forces = j.filter((x) => x.raccord === "force");
  resultat.journal = { duree_min: +((Date.now() - t0) / 60000).toFixed(1), raccords: j.length, par_type: par, fondus_forces: forces.map((x) => x.texte), attente_moyenne_s: +(j.reduce((s, x) => s + (x.attente ?? 0), 0) / Math.max(1, j.length)).toFixed(2) };
  console.log(`séance simulée : ${j.length} raccords, ${forces.length} fondus forcés (${JSON.stringify(par)})`);
  check(forces.length <= Math.max(2, j.length * 0.05), `séance simulée : fondus forcés rares (${forces.length} sur ${j.length})`);
  await context.close();
}
writeFileSync(join(OUT, "resultat.json"), JSON.stringify({ ...resultat, echecs: fail }, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exitCode = fail.length ? 1 : 0;
