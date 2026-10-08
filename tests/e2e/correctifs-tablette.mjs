// LOT « CORRECTIFS DE LA TABLETTE » (docs/LOTS.md, fiche 6 ; décisions du parent du 8 octobre 2026) : le parcours du lot.
// À 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures de chaque situation nouvelle :
//   1. l'écran de démarrage (le logo, la barre qui avance pendant le chargement, prête), le toucher qui le fait disparaître,
//      la bienvenue de la mascotte à l'accueil, une fois par lancement ;
//   2. choisir en deux touchers, sur chaque écran de choix (exercices ; niveaux de chaque exercice ; menu des leçons, tables
//      comprises ; entraînement libre) : le premier toucher sélectionne (bordure), la mascotte dit le nom et la description,
//      la bulle part d'un coin de la tuile (capturée dans les quatre coins de l'écran) sans couvrir la tuile ; une autre tuile
//      prend la sélection ; un toucher dehors désélectionne ; l'appui long ne lance rien ; le second toucher lance ;
//   3. toucher la mascotte pour réécouter (plus de bouton « réécouter » à côté d'elle ; le bouton revient dans le récif) ;
//   4. (1280 seulement) le clavier de l'ordinateur dans chaque exercice à pavé (additions, calcul rapide et ses calculs
//      guidés, multiplication, dictée, défi), et l'ardoise jamais vide (relevé continu) ;
// et, comme tous les parcours, aucune phrase dite sans fichier hors de l'inventaire (tests/e2e/navigateur.mjs).
//   node tests/e2e/correctifs-tablette.mjs [--out dossier] [--seul 1280|1920]
import { chromium, demarrageReel } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/correctifs-tablette")), SEUL = opt("--seul", null);
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const BASE = "?nosw&son=non&voix=rapide";
const resultat = { date: new Date().toISOString(), bulles: [], ardoise: [], clavier: [] };
const sleep = (p, ms) => p.waitForTimeout(ms);

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]]) {
  if (SEUL && SEUL !== String(W)) continue;
  const out = join(OUT, String(W)); mkdirSync(out, { recursive: true });
  const nouveau = async (reel = false) => {
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true });
    if (reel) await demarrageReel(context);
    const page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    return { context, page, errors };
  };
  const shot = (page, nom) => page.screenshot({ path: join(out, `${nom}.png`) });
  const tap = async (page, sel, ms = 300) => { await page.tap(sel, { force: true }); await sleep(page, ms); };
  const bulle = (page) => page.evaluate(() => window.__app.bulle.etat());

  // ---------------------------------------------------------------- 1. l'écran de démarrage
  {
    const { context, page, errors } = await nouveau(true);
    // les vidéos de la mascotte arrivent lentement : la barre avance par pas
    await page.route("**/assets/mascotte/*.webm", async (r) => { await new Promise((res) => setTimeout(res, 400 + Math.random() * 1600)); await r.continue(); });
    await page.goto(url + BASE);
    await page.waitForSelector(".demarrage-logo"); await sleep(page, 500);
    const part = () => page.evaluate(() => { const m = /inset\(0(?:px)? ([\d.]+)%/.exec(document.querySelector(".demarrage-barre.plein")?.style.clipPath ?? ""); return m ? 100 - Number(m[1]) : null; });
    const p1 = await part(); await shot(page, "01-demarrage-chargement");
    const info = await page.evaluate(() => !!document.querySelector(".demarrage-info"));
    check(info, `${W} démarrage : les petites lignes d'information (2026, js2c, la version)`);
    const suite = [p1]; for (let i = 0; i < 6; i++) { await sleep(page, 400); suite.push(await part()); }
    check(suite.every((v, i) => i === 0 || v >= suite[i - 1]) && suite.at(-1) > p1, `${W} démarrage : la barre avance (${suite.map((v) => Math.round(v)).join(" → ")} %)`);
    await page.waitForSelector(".demarrage.pret", { timeout: 60000 }); await sleep(page, 600);
    check(Math.round(await part()) === 100, `${W} démarrage : la barre est pleine quand tout est chargé`);
    check(await page.evaluate(() => window.__app?.ocean.mascotte.etat().pret === true), `${W} démarrage : prêt seulement quand les vidéos de la mascotte sont chargées`);
    await shot(page, "02-demarrage-pret");
    check(await page.evaluate(() => window.__ready === undefined), `${W} démarrage : l'accueil attend le toucher`);
    await page.touchscreen.tap(Math.round(W * 0.3), Math.round(H * 0.3)); // n'importe où sur l'écran
    await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 10000 });
    await page.waitForFunction(() => window.__app.bulle.etat().visible, null, { timeout: 10000 }); await sleep(page, 300);
    const b = await bulle(page), bienvenue = T.bienvenueLancement;
    check(!(await page.evaluate(() => !!document.querySelector(".demarrage"))), `${W} démarrage : un toucher le fait disparaître`);
    check(bienvenue.includes(b.texte), `${W} accueil : la mascotte souhaite la bienvenue (« ${b.texte} »)`);
    check(await page.evaluate(() => window.__app.voice.unlocked), `${W} démarrage : le toucher a autorisé la voix`);
    await shot(page, "03-accueil-bienvenue");
    // une fois par lancement : le récif, puis retour à l'accueil, sans nouvelle bienvenue
    await page.waitForFunction(() => !window.__app.voice.speaking, null, { timeout: 15000 });
    const dit = await page.evaluate(() => { const v = window.__app.voice, s = v.say.bind(v); window.__dit = []; v.say = (t, o) => { window.__dit.push(t); return s(t, o); }; return true; });
    await tap(page, ".reefkey", 2500); await tap(page, ".homekey", 1500);
    const redit = await page.evaluate(() => window.__dit.filter((t) => /Coucou|revoilà|retrouver|te voilà/.test(t)));
    check(dit && redit.length === 0, `${W} accueil : la bienvenue n'est dite qu'une fois par lancement`);
    check(errors.length === 0, `${W} démarrage : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }

  // ---------------------------------------------------------------- 2. choisir en deux touchers
  {
    const { context, page, errors } = await nouveau();
    await page.goto(url + BASE); await page.waitForFunction(() => window.__ready !== undefined);
    // la bulle d'une tuile : son texte, sa place, et la règle (dans l'écran, sans couvrir la tuile)
    const controle = async (sel, nom, attendu) => {
      await page.waitForFunction(() => window.__app.bulle.etat().visible, null, { timeout: 8000 }).catch(() => {});
      await sleep(page, 350);
      const r = await page.evaluate((s) => {
        const e = document.querySelector(s), x = parseFloat(e.style.left), y = parseFloat(e.style.top); // (la place de la tuile, hors de son rebond)
        return { tuile: [x, y, x + parseFloat(e.style.width), y + parseFloat(e.style.height)], bulle: window.__app.bulle.etat() };
      }, sel);
      const { rect, place, texte, visible } = r.bulle, t = r.tuile;
      const dedans = rect && rect[0] >= 0 && rect[1] >= 0 && rect[2] <= 1280 && rect[3] <= 800;
      const surTuile = rect && Math.min(rect[2], t[2]) - Math.max(rect[0], t[0]) > 0 && Math.min(rect[3], t[3]) - Math.max(rect[1], t[1]) > 0;
      resultat.bulles.push({ W, nom, place, texte, rect: rect?.map(Math.round), tuile: t.map(Math.round) });
      check(visible && /^tuile-/.test(place ?? "") && dedans && !surTuile, `${W} ${nom} : la bulle part d'un coin de la tuile (${place}), dans l'écran, sans la couvrir`);
      if (attendu) check(texte === attendu, `${W} ${nom} : le nom et la description (« ${texte} »)`);
      await shot(page, nom);
      return r;
    };
    const D = T.choixDescription;
    await tap(page, ".choisir", 1200); await page.waitForSelector(".choix-ex");
    // les exercices : un toucher sélectionne sans lancer
    await tap(page, '.choix-ex[data-key="ligne"]', 400);
    check((await page.locator(".choix-tuile").count()) === 0, `${W} exercices : le premier toucher ne lance pas`);
    await controle('.choix-ex[data-key="ligne"]', "10-exercices-selection-ligne", `${T.choixNom.ligne} ${D.exercices.ligne}`);
    // une autre tuile prend la sélection
    await tap(page, '.choix-ex[data-key="multiplication"]', 400);
    await controle('.choix-ex[data-key="multiplication"]', "11-exercices-autre-selection", `${T.choixNom.multiplication} ${D.exercices.multiplication}`);
    // un toucher dehors désélectionne : le toucher suivant sur la même tuile la sélectionne à nouveau, sans lancer
    await page.touchscreen.tap(Math.round(W * 0.55), Math.round(H * 0.18)); await sleep(page, 400);
    await shot(page, "12-exercices-dehors");
    check(!(await bulle(page)).visible || !/^tuile-/.test((await bulle(page)).place ?? ""), `${W} exercices : un toucher dehors désélectionne (la bulle s'en va)`);
    await tap(page, '.choix-ex[data-key="multiplication"]', 400);
    check((await page.locator(".choix-tuile").count()) === 0, `${W} exercices : après « dehors », un toucher sélectionne seulement`);
    // l'appui long ne lance rien
    const box = await page.locator('.choix-ex[data-key="multiplication"]').boundingBox(), cdp = await context.newCDPSession(page), pt = [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }];
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt }); await sleep(page, 1100); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await sleep(page, 400);
    check((await page.locator(".choix-tuile").count()) === 0, `${W} exercices : l'appui long ne lance rien`);
    // chaque exercice : ses niveaux, une tuile dans chaque coin de l'écran
    for (const ex of ["ligne", "additions", "calcul", "voiliers", "multiplication"]) {
      await tap(page, `.choix-ex[data-key="${ex}"]`, 350); await tap(page, `.choix-ex[data-key="${ex}"]`, 1200);
      await page.waitForSelector(".choix-tuile");
      const keys = await page.evaluate(() => [...document.querySelectorAll(".choix-tuile")].map((e) => { const r = e.getBoundingClientRect(); return { k: e.dataset.key, x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
      const coin = (fx, fy) => keys.reduce((a, b) => (fx * b.x + fy * b.y > fx * a.x + fy * a.y ? b : a)).k;
      const noms = { ligne: T.choixLigne, additions: T.choixFamille, calcul: T.choixCalcul, voiliers: T.choixVoiliers, multiplication: T.choixMult }[ex];
      for (const [c, k] of [["haut-gauche", coin(-1, -1)], ["haut-droite", coin(1, -1)], ["bas-gauche", coin(-1, 1)], ["bas-droite", coin(1, 1)]]) {
        await tap(page, `.choix-tuile[data-key="${k}"]`, 350);
        await controle(`.choix-tuile[data-key="${k}"]`, `2-${ex}-${c}-${k}`, `${noms[k]} ${D[ex][k]}`);
      }
      // la sélection est distincte du halo du conseillé : une tuile conseillée sélectionnée garde son halo, et sa bordure
      check((await page.locator(".choix-tuile").count()) > 0, `${W} ${ex} : les niveaux restent à l'écran pendant la sélection`);
      await tap(page, ".choix-retour", 1000); await page.waitForSelector(".choix-ex");
    }
    // le second toucher lance : additions, famille 3, puis le sélecteur de difficulté
    await tap(page, '.choix-ex[data-key="additions"]', 350); await tap(page, '.choix-ex[data-key="additions"]', 1200);
    await tap(page, '.choix-tuile[data-key="3"]', 350); await tap(page, '.choix-tuile[data-key="3"]', 300);
    await page.waitForSelector(".cran", { timeout: 20000 });
    check(true, `${W} le second toucher sur la même tuile lance (le sélecteur de difficulté)`);
    await shot(page, "29-lance-selecteur");
    await context.close();

    // le menu des leçons, tables comprises
    const L = await nouveau();
    await L.page.goto(url + BASE); await L.page.waitForFunction(() => window.__ready !== undefined);
    await tap(L.page, ".leconskey", 1200); await L.page.waitForSelector(".lecons-tuile");
    const pageL = L.page;
    const ctrlL = async (k, nom, attendu) => {
      await tap(pageL, `.lecons-tuile[data-key="${k}"]`, 350);
      const r = await pageL.evaluate(() => window.__app.bulle.etat());
      resultat.bulles.push({ W, nom, place: r.place, texte: r.texte, rect: r.rect?.map(Math.round) });
      check(r.visible && /^tuile-/.test(r.place ?? "") && r.texte === attendu, `${W} ${nom} : la bulle de la tuile (${r.place}), « ${r.texte} »`);
      check((await pageL.locator(".lecons-tuile").count()) > 0, `${W} ${nom} : le premier toucher ne lance pas`);
      await pageL.screenshot({ path: join(out, `${nom}.png`) });
    };
    await ctrlL("L1", "30-lecons-L1", `${T.choixLeconNom.L1} ${D.lecons.L1}`);
    await ctrlL("L13", "31-lecons-L13", `${T.choixLeconNom.L13} ${D.lecons.L13}`);
    await ctrlL("table.multiplication", "32-lecons-table-multiplication", `${T.choixTableMult} ${D.tables.multiplication}`);
    await ctrlL("L7", "33-lecons-L7", `${T.choixLeconNom.L7} ${D.lecons.L7}`);
    await tap(pageL, '.lecons-tuile[data-key="L7"]', 300);
    await pageL.waitForSelector(".skip", { timeout: 20000 });
    check(true, `${W} leçons : le second toucher lance la leçon`);
    check(L.errors.length === 0 && errors.length === 0, `${W} choisir et leçons : aucune erreur (${[...errors, ...L.errors].join(" | ")})`);
    await L.context.close();

    // l'entraînement libre : la séance du jour finie, « Encore ! » ouvre le même écran, en deux touchers
    const F = await nouveau();
    await F.page.goto(url + BASE + "&cran=conseille&sans=echauffement,notion,defi"); await F.page.waitForFunction(() => window.__ready !== undefined);
    await tap(F.page, ".play", 500);
    await F.page.waitForSelector(".again", { timeout: 120000 }).catch(() => {});
    for (let i = 0; i < 40 && !(await F.page.locator(".again").count()); i++) { await F.page.touchscreen.tap(640, 400); await sleep(F.page, 1500); }
    await tap(F.page, ".again", 1500); await F.page.waitForSelector(".choix-ex", { timeout: 20000 });
    await tap(F.page, '.choix-ex[data-key="calcul"]', 450);
    const fb = await F.page.evaluate(() => window.__app.bulle.etat());
    check(fb.visible && /^tuile-/.test(fb.place ?? "") && (await F.page.locator(".choix-tuile").count()) === 0, `${W} entraînement libre : le premier toucher sélectionne (${fb.place})`);
    await F.page.screenshot({ path: join(out, "40-libre-selection.png") });
    await tap(F.page, '.choix-ex[data-key="calcul"]', 1200); await F.page.waitForSelector(".choix-tuile");
    await tap(F.page, '.choix-tuile[data-key="4"]', 450); await F.page.screenshot({ path: join(out, "41-libre-niveau.png") });
    await tap(F.page, '.choix-tuile[data-key="4"]', 300); await F.page.waitForSelector(".cran", { timeout: 20000 });
    check(true, `${W} entraînement libre : le second toucher lance`);
    check(F.errors.length === 0, `${W} entraînement libre : aucune erreur (${F.errors.join(" | ")})`);
    await F.context.close();
  }

  // ---------------------------------------------------------------- 3. toucher la mascotte pour réécouter
  {
    const { context, page, errors } = await nouveau();
    await page.goto(url + BASE + "&choix=2:3&cran=conseille&sans=echauffement&sansLecon&guides=0"); await page.waitForFunction(() => window.__ready !== undefined);
    const vis = (s) => page.evaluate((s) => { const e = document.querySelector(s); return !!e && getComputedStyle(e).visibility !== "hidden"; }, s);
    check(await vis(".mascotte-tap") && !(await vis(".speaker")), `${W} accueil : plus de bouton « réécouter » ; la mascotte se touche`);
    const zone = await page.locator(".mascotte-tap").boundingBox(), k = W / 1280;
    check(zone.width >= 64 * k && zone.height >= 64 * k && zone.width >= 200 * k, `${W} la zone à toucher couvre toute la tête (${Math.round(zone.width / k)} × ${Math.round(zone.height / k)} px)`);
    await tap(page, ".play", 500);
    await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && !f.locked && f.resolve && !window.__app.voice.speaking; }, null, { timeout: 30000 });
    const avant = await page.evaluate(() => window.__app.voice.listens);
    await tap(page, ".mascotte-tap", 250);
    const apres = await page.evaluate(() => ({ n: window.__app.voice.listens, b: window.__app.bulle.etat(), c: window.__app.voice.instruction }));
    check(apres.n === avant + 1 && apres.b.visible && apres.b.texte === apres.c, `${W} toucher la mascotte : la consigne redite, la bulle refaite, une écoute de plus (${avant} → ${apres.n})`);
    await shot(page, "50-toucher-mascotte");
    // le récif : pas de mascotte, le bouton « réécouter » revient
    await tap(page, ".session-home", 900); await tap(page, ".keep.reefkey", 2500);
    check(await vis(".speaker") && !(await vis(".mascotte-tap")), `${W} récif : la mascotte n'y est pas, le bouton « réécouter » revient`);
    await shot(page, "51-recif-reecouter");
    check(errors.length === 0, `${W} réécouter : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }

  // ---------------------------------------------------------------- 4. le clavier dans chaque exercice à pavé, l'ardoise jamais vide
  if (W !== 1280) continue;
  const reponse = () => {
    const f = window.__app.facts, q = f.q;
    if (q.dictee) return String(q.answer);
    if (q.pont) return String(q.n);
    if (q.module === 5) return String(q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a * q.b);
    if (q.module === 3) return String(q.forme === "trouDroite" ? (q.op === "-" ? q.a - q.n : q.n - q.a) : q.forme === "trouGauche" ? (q.op === "-" ? q.n + q.b : q.n - q.b) : q.n);
    const n = q.n ?? q.a + q.b; return String(q.forme === "trouDroite" ? n - q.a : q.forme === "trouGauche" ? n - q.b : n);
  };
  const veille = () => { window.__vides = []; setInterval(() => { const f = window.__app?.facts; if (!f) return; const s = f.slate, v = getComputedStyle(s).visibility === "visible" && !s.closest(".stash") && !document.querySelector("#stage.paused"); if (v && !f.q && !f.slateQ) window.__vides.push(window.__app.bulle.etat().texte || "(silence)"); }, 40); };
  const exos = [
    ["additions (échauffement et notion du jour)", "&choix=2:3&cran=conseille&faits=3&guides=0&sansLecon", 6],
    ["calcul rapide (calculs guidés d'un niveau nouveau)", "&choix=3:4&cran=conseille&sans=echauffement&sansLecon", 6],
    ["calcul rapide (questions)", "&choix=3:2&cran=conseille&sans=echauffement&sansLecon", 4],
    ["multiplication", "&choix=5:3&cran=conseille&sans=echauffement&sansLecon&guides=0", 4],
    ["dictée (ligne, niveau 12, avec son exemple guidé)", "&choix=1:12&cran=conseille&sans=echauffement&sansLecon&guides=1", 3],
  ];
  for (const [nom, q, n] of exos) {
    const { context, page, errors } = await nouveau();
    await page.addInitScript(veille);
    await page.goto(url + BASE + q); await page.waitForFunction(() => window.__ready !== undefined);
    await tap(page, ".play", 500);
    let faites = 0, effaceOk = true, i = 0;
    for (const until = Date.now() + 120000; faites < n && Date.now() < until;) {
      const pret = await page.evaluate(() => { const f = window.__app.facts; return !!(f?.q && !f.locked && f.resolve && [...document.querySelectorAll(".key")].some((k) => getComputedStyle(k).visibility === "visible")); });
      if (!pret) { await sleep(page, 150); continue; }
      const v = await page.evaluate(reponse);
      // un chiffre de trop, effacé par « Retour arrière » (une fois sur deux, au pavé numérique)
      if (i % 2 === 0) { await page.keyboard.press("Numpad7"); await sleep(page, 200); await page.keyboard.press("Backspace"); await sleep(page, 200); effaceOk &&= (await page.evaluate(() => window.__app.facts.typed)) === ""; }
      for (const d of v) { await page.keyboard.press(i % 2 ? `Digit${d}` : `Numpad${d}`); await sleep(page, 180); }
      const tape = await page.evaluate(() => window.__app.facts.typed);
      await page.keyboard.press("Enter"); faites++; i++;
      resultat.clavier.push({ exo: nom, tape, attendu: v });
      if (faites === 1) { await sleep(page, 120); await shot(page, `60-clavier-${nom.split(" ")[0]}`); }
      await sleep(page, 400);
    }
    const db = await page.evaluate(async () => (await window.__app.store.all("reponses")).slice(-12).map((r) => r.juste));
    const vides = await page.evaluate(() => [...new Set(window.__vides)]);
    resultat.ardoise.push({ exo: nom, vides });
    check(faites >= n && effaceOk, `clavier · ${nom} : chiffres, « Retour arrière » et « Entrée » font comme le pavé (${faites} réponses)`);
    check(db.length > 0 && db.filter(Boolean).length >= Math.min(faites, db.length) - 1, `clavier · ${nom} : les réponses tapées au clavier sont justes (${db.filter(Boolean).length}/${db.length})`);
    check(vides.length === 0, `ardoise · ${nom} : jamais vide à l'écran${vides.length ? ` (vide pendant : ${vides.join(" | ")})` : ""}`);
    check(errors.length === 0, `${nom} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
  // le défi record (au clavier) : cinq séances déjà faites et dix faits bien sus
  {
    const { context, page, errors } = await nouveau();
    await page.addInitScript(veille);
    await page.goto(url + BASE + "&cran=conseille&sans=echauffement,notion"); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(async () => {
      const s = window.__app.store, now = Date.now(), DAY = 86400000;
      for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
      for (const [i, k] of ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"].entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
    });
    await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
    await tap(page, ".play", 500);
    await page.waitForFunction(() => window.__app.challenge && window.__app.facts?.resolve && !window.__app.facts.locked, null, { timeout: 60000 });
    let faites = 0;
    for (const until = Date.now() + 20000; faites < 6 && Date.now() < until;) {
      const q = await page.evaluate(() => { const f = window.__app.facts; return f?.resolve && !f.locked && f.defi ? (f.q.forme === "trouDroite" ? f.q.b : f.q.forme === "trouGauche" ? f.q.a : f.q.a + f.q.b) : null; });
      if (q === null) { await sleep(page, 80); continue; }
      for (const d of String(q)) { await page.keyboard.press(d); await sleep(page, 170); }
      await page.keyboard.press("Enter"); faites++; await sleep(page, 350);
      if (faites === 2) await shot(page, "61-clavier-defi");
    }
    const vides = await page.evaluate(() => [...new Set(window.__vides)]);
    resultat.ardoise.push({ exo: "défi", vides });
    check(faites >= 6, `clavier · défi record : ${faites} réponses tapées au clavier`);
    check(vides.length === 0, `ardoise · défi : jamais vide à l'écran${vides.length ? ` (vide pendant : ${vides.join(" | ")})` : ""}`);
    check(errors.length === 0, `défi : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
}
writeFileSync(join(OUT, "resultat.json"), JSON.stringify(resultat, null, 1));
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
if (fail.length) process.exitCode = 1;
await browser.close(); srv.close();
