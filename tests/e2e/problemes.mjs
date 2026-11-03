// LOT « PROBLÈMES » (docs/LOTS.md, fiche 20 ; docs/SPEC.md, section 7 quinquies) : le parcours de chaque situation nouvelle, en
// 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures dans tests/e2e/out/problemes :
//  1. « choisir » : sept exercices sur deux rangées, les problèmes, leurs 9 niveaux, la légende ;
//  2. l'étape fixe « Problème du jour » dans une séance « jouer » (après la notion du jour, la notion raccourcie à 4 min 30) ;
//  3. l'exercice choisi (niveau 2) : l'histoire et ses étiquettes qui s'allument, toucher une étiquette (sa phrase redite), la mascotte
//     touchée (l'histoire entière et la question), la bonne réponse (la plaque verte) ; le lieu avec son image (l'étal) ;
//  4. chaque erreur et son aide : P1 (comparaison : sa phrase, la comparaison), P2, P3 (le schéma en barres), P4 (les deux schémas
//     numérotés) ; « je ne sais pas » ; un lieu sans image ;
//  5. le niveau 3 : le partage manipulé (les objets glissés un à un ; un contenant plein refuse) puis la réponse ; les groupes égaux
//     montrés formés ;
//  6. les crans : « plus facile » (les objets dessinés, l'histoire redite, jamais de schéma d'emblée), « plus dur » et « très dur »
//     (sans coquillage) ; le coquillage au cran conseillé ;
//  7. la pause et la reprise (la maison pendant un problème, puis « continuer » : le problème reposé) ;
//  8. la leçon L19 depuis le menu des leçons (sa rangée, jusqu'au bout), « À toi ! » ;
//  9. l'espace parent : le bloc du module 7, les réglages (niveau de départ, problème du jour).
// Contrôles : aucune erreur de page, la bulle ne couvre jamais ce qu'on touche ni les étiquettes, l'aide ou la plaque de la réponse.
//   node tests/e2e/problemes.mjs [--out dossier] [--seul 1280|1920]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie la logique et l'affichage de nombreuses situations, chacune sur une base neuve dans un navigateur neuf : à
// la vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application pour chaque situation n'apporterait
// rien à ce qu'il vérifie ; le son ne change rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur
// le banc Android : journee.mjs, enfant.mjs --android, installation.mjs, veille.mjs.)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(opt("--out", "tests/e2e/out/problemes")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null), textes = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url), "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: [] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const journal = [];

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]].filter(([w]) => !SEUL || String(w) === SEUL)) {
  const T = `${W}`, big = W === 1280;
  const open = async (q = "") => {
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; const p = window.__app.prob, al = p.allumer.bind(p); window.__lit = []; p.allumer = (i) => { window.__lit.push([i, window.__said.at(-1) ?? ""]); return al(i); }; });
    return { page, context, errors };
  };
  const shot = (page, n) => page.screenshot({ path: join(OUT, `${T}-${n}.png`) });
  const tap = async (page, sel, wait = 250) => { await page.tap(sel, { force: true }); await page.waitForTimeout(wait); };
  const said = (page) => page.evaluate(() => window.__said.join(" | "));
  const resetSaid = (page) => page.evaluate(() => { window.__said = []; });
  const note = async (page, quoi) => { if (big) journal.push({ quoi, dit: await page.evaluate(() => [...window.__said]) }); };
  const bulle = (page) => page.evaluate(() => window.__app.bulle.etat());
  const q7 = (page, t = 60000) => page.waitForFunction(() => { const s = window.__app.facts; return s?.q?.module === 7 && s.resolve && !s.locked; }, null, { timeout: t, polling: 100 });
  const qid = (page) => page.evaluate(() => window.__app.facts.q.id);
  const rep = (page) => page.evaluate(() => window.__app.facts.q.e.reponse);
  const typeIn = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(160); } await page.tap('.key[data-key="valider"]', { force: true }); };
  const finPhrases = (page) => page.waitForFunction(() => /\?$/.test(window.__said.at(-1) ?? "") || /réécouter/.test(window.__said.at(-1) ?? ""), null, { timeout: 30000 }).catch(() => {});
  const visible = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden" && !e.closest(".stash")).length, sel);
  const zonesOk = async (page, quoi) => { const b = await bulle(page); check(!b.visible || (!b.couvre && !(b.zones ?? []).some(() => false)), `${T} · ${quoi} : la bulle ne couvre rien de ce qu'on touche (${b.place ?? "cachée"})`); };
  const fermer = async (o, quoi) => { check(!o.errors.length, `${T} · ${quoi} : aucune erreur de page (${o.errors.slice(0, 2).join(" ; ")})`); await o.context.close(); };

  // 1. « choisir » : sept exercices, les problèmes, leurs 9 niveaux, la légende
  {
    const o = await open(), { page } = o;
    await page.waitForSelector(".choisir"); await tap(page, ".choisir", 900);
    await page.waitForSelector(".choix-ex", { timeout: 20000 }); await page.waitForTimeout(600);
    check((await page.locator(".choix-ex").count()) === 7, `${T} · « choisir » : sept exercices`);
    await shot(page, "01-choisir-exercices");
    await tap(page, '.choix-ex[data-key="problemes"]', 500); await zonesOk(page, "la tuile des problèmes sélectionnée");
    check((await said(page)).includes(textes.choixNom.problemes), `${T} · son nom dit (${(await said(page)).slice(-80)})`);
    await tap(page, '.choix-ex[data-key="problemes"]', 900); await page.waitForSelector(".choix-tuile", { timeout: 10000 });
    const tuiles = await page.evaluate(() => [...document.querySelectorAll(".choix-tuile")].map((e) => `${e.dataset.key}${e.dataset.conseille ? "*" : ""}`).join(","));
    check(tuiles === "1,2*,3,4,5,6,7,8,9", `${T} · les 9 niveaux, le 2 conseillé (${tuiles})`);
    await shot(page, "02-choisir-niveaux");
    if (big) { await tap(page, ".legende", 600); check((await page.locator(".legende-ligne").count()) === 9, `${T} · la légende : 9 lignes`); await shot(page, "03-legende"); }
    await fermer(o, "choisir");
  }

  // 2. l'étape fixe dans une séance « jouer »
  {
    const o = await open("&sans=echauffement&questions=2&guides=0&sansLecon"), { page } = o;
    // (la notion du jour : les additions, imposées pour la séance ; le parcours répond juste à ses questions)
    await page.evaluate(async () => { await window.__app.store.setSetting("moduleImpose", { module: 2 }); });
    await tap(page, ".play");
    for (let i = 0; i < 120; i++) {
      const st = await page.evaluate(async () => { const f = window.__app.facts, q = f?.q; if (q?.module === 7) return "probleme"; if (!q || !f.resolve || f.locked || (q.module && q.module !== 2)) return null; const { expected } = await import("./js/modules/facts/facts.js"); return expected(q); });
      if (st === "probleme") break;
      if (typeof st === "number") await typeIn(page, st); await page.waitForTimeout(700);
    }
    await page.waitForFunction(() => window.__app.facts?.q?.module === 7 && window.__app.facts.q.etape, null, { timeout: 60000 });
    await finPhrases(page); await page.waitForTimeout(500);
    const etapes = await page.evaluate(() => window.__app.session.rec.etapes.map((e) => e.id).join(","));
    check(etapes.includes("notion") && !etapes.includes("probleme"), `${T} · le problème du jour vient après la notion du jour (${etapes})`);
    check((await said(page)).includes(textes.problemeDuJour[0]) || (await said(page)).includes(textes.problemeDuJour[1]), `${T} · « Le problème du jour ! »`);
    await shot(page, "04-probleme-du-jour"); await zonesOk(page, "le problème du jour");
    await typeIn(page, await rep(page)); await page.waitForTimeout(1200);
    await shot(page, "05-probleme-du-jour-juste");
    // (le second problème, s'il reste assez de temps : répondu aussi, jusqu'à la fin de l'étape)
    for (let i = 0; i < 60 && !(await page.evaluate(() => window.__app.session.rec.etapes.some((e) => e.id === "probleme"))); i++) {
      if (await page.evaluate(() => { const f = window.__app.facts; return f?.q?.module === 7 && f.resolve && !f.locked && !window.__app.prob.occupe; })) await typeIn(page, await rep(page));
      await page.waitForTimeout(1000);
    }
    const pb = await page.evaluate(() => window.__app.session.rec.etapes.find((e) => e.id === "probleme"));
    check(pb && pb.dureeS <= 100, `${T} · l'étape tient dans ses 1 min 30 (${pb?.dureeS} s)`);
    await fermer(o, "le problème du jour");
  }

  // 3. l'exercice choisi : l'histoire, les étiquettes, une étiquette touchée, la mascotte, la bonne réponse (l'étal : le lieu avec image)
  {
    const o = await open("&choix=7:2&cran=conseille&sans=echauffement&sansLecon&questions=6&enonce=tra-pf-13,cmp-e-01,reu-t-01,etp-01,tra-pf-19,reu-t-03"), { page } = o;
    await tap(page, ".play");
    await page.waitForFunction(() => window.__app.facts?.q?.module === 7, null, { timeout: 60000 });
    await page.waitForFunction(() => window.__said.some((t) => /23 sardines/.test(t)), null, { timeout: 20000 }); await page.waitForTimeout(150);
    await shot(page, "06-histoire-etiquette-allumee");
    const lit = await page.evaluate(() => window.__lit.filter(([i]) => i >= 0).map(([i]) => i).join(","));
    check(lit.startsWith("0,1"), `${T} · les étiquettes s'allument l'une après l'autre, avec leur phrase (${lit})`);
    await q7(page); await finPhrases(page); await page.waitForTimeout(400);
    check((await visible(page, ".probleme-etiquette")) === 2, `${T} · deux étiquettes, touchables`);
    await shot(page, "07-question"); await zonesOk(page, "la question");
    await resetSaid(page); await tap(page, '.probleme-etiquette[data-n="9"]', 900);
    check((await said(page)).includes("Il en vend 9."), `${T} · toucher l'étiquette 9 redit sa phrase (${await said(page)})`);
    await resetSaid(page); await page.evaluate(() => window.__app.voice.replay()); await page.waitForTimeout(600);
    check(/23 sardines.*Il en vend 9.*Combien/.test(await said(page)), `${T} · la mascotte redit l'histoire entière et la question (${(await said(page)).slice(0, 90)})`);
    await page.waitForTimeout(1200);
    await typeIn(page, 14); await page.waitForTimeout(500);
    await shot(page, "08-juste");
    // 4. les erreurs : P1 à la comparaison (7 billes, 4 billes : 3 de plus ; « 11 »)
    await q7(page); check((await qid(page)) === "cmp-e-01", `${T} · la comparaison`); await finPhrases(page);
    await resetSaid(page); await typeIn(page, 11);
    await page.waitForFunction((t) => window.__said.includes(t), textes.erreurProbleme.P1comparaison, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(700); await shot(page, "09-P1-comparaison"); await zonesOk(page, "l'aide de la comparaison");
    check((await said(page)).includes(textes.erreurProbleme.P1comparaison), `${T} · P1 à la comparaison : « de plus » ne veut pas dire ajouter`);
    // P2 : un nombre de l'histoire redit (4 pommes et 3 poires : « 4 »)
    await q7(page); await finPhrases(page); await resetSaid(page); await typeIn(page, 4);
    await page.waitForFunction((t) => window.__said.includes(t), textes.erreurProbleme.P2, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(900); await shot(page, "10-P2-barres");
    check((await said(page)).includes(textes.erreurProbleme.P2), `${T} · P2 : « Tu as redit un nombre de l'histoire »`);
    await page.waitForFunction(() => window.__said.some((t) => /ça fait 7 fruits/.test(t)), null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(400);
    await shot(page, "11-correction-calcul");
    // P4 : deux étapes, la réponse de la première (11)
    await q7(page); await finPhrases(page); await resetSaid(page); await typeIn(page, 11);
    await page.waitForFunction((t) => window.__said.includes(t), textes.erreurProbleme.P4, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500); await shot(page, "12-P4-deux-etapes");
    check((await said(page)).includes(textes.erreurProbleme.P4), `${T} · P4 : la réponse de la première étape`);
    // P3 : la bonne opération, une erreur de compte (à 1 ou à 10 près, pour le problème qui vient : l'ordre imposé laisse revenir les
    // problèmes manqués plus haut)
    await q7(page); await finPhrases(page); await resetSaid(page);
    await typeIn(page, await page.evaluate(async () => { const { classer } = await import("./js/modules/problemes/problemes.js"), e = window.__app.facts.q.e; return [e.reponse + 1, e.reponse - 1, e.reponse + 10].find((v) => v >= 0 && classer(e, v) === "P3"); }));
    await page.waitForFunction((t) => window.__said.includes(t), textes.erreurProbleme.P3, { timeout: 15000 }).catch(() => {});
    check((await said(page)).includes(textes.erreurProbleme.P3), `${T} · P3 : une petite erreur de compte`);
    // « je ne sais pas » ; un lieu sans image (la classe)
    await q7(page); await finPhrases(page); await resetSaid(page); await tap(page, ".nsp", 900);
    check((await said(page)).includes(textes.faitNSP), `${T} · « je ne sais pas » : « Ce n'est pas grave »`);
    await page.waitForTimeout(800); await shot(page, "13-nsp-lieu-sans-image");
    await note(page, "l'exercice choisi : bonne réponse, P1, P2, P4, P3, je ne sais pas");
    for (let i = 0; i < 60 && !(await page.evaluate(async () => (await window.__app.store.all("reponses")).some((r) => r.module === 7 && r.erreur === "NSP"))); i++) await page.waitForTimeout(500);
    const codes = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 7).map((r) => r.erreur ?? "juste").join(","));
    check(/juste.*P1.*P2.*P4.*P3.*NSP/.test(codes), `${T} · les réponses enregistrées avec leur code (${codes})`);
    await fermer(o, "l'exercice choisi");
  }

  // 5. le niveau 3 : le partage manipulé, les groupes égaux formés
  {
    const o = await open("&choix=7:3&cran=conseille&sans=echauffement&sansLecon&questions=3&enonce=par-v-01,grp-03"), { page } = o;
    await tap(page, ".play");
    await page.waitForFunction(() => document.querySelectorAll(".probleme-objet").length === 6, null, { timeout: 60000 }); await page.waitForTimeout(400);
    check((await visible(page, '.key[data-key="3"]')) === 0, `${T} · le partage : le pavé attend que les objets soient rangés`);
    await shot(page, "14-partage-tas");
    const k = await page.evaluate(() => window.__app.stage.k);
    const glisser = async (x0, y0, x1, y1) => { await page.mouse.move(x0, y0); await page.mouse.down(); await page.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 5 }); await page.mouse.move(x1, y1, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(220); };
    const objets = () => page.$$eval(".probleme-objet", (L) => L.map((e) => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
    const c = await page.evaluate(() => { const r = window.__app.prob.calques.get("contenants").getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }), cx = (i) => c[0] + 10 * k + ((c[2] - 20 * k) / 2) * (i + 0.5), cy = c[1] + c[3] * 0.62;
    // trois dans la première assiette, puis un quatrième refusé
    for (let i = 0; i < 3; i++) { const [x, y] = (await objets())[0]; await glisser(x, y, cx(0), cy); }
    if (big) await shot(page, "15-partage-trois");
    await resetSaid(page); { const [x, y] = (await objets())[0]; await glisser(x, y, cx(0), cy); }
    check((await page.locator(".probleme-objet").count()) === 3 && (await said(page)).includes(textes.problemeMettre.assiette), `${T} · une assiette pleine refuse l'objet : « Mets-en autant dans chaque assiette. »`);
    for (let i = 0; i < 3; i++) { const [x, y] = (await objets())[0]; await glisser(x, y, cx(1), cy); }
    await page.waitForFunction(() => !document.querySelector(".probleme-objet"), null, { timeout: 5000 }).catch(() => {}); await page.waitForTimeout(600);
    check((await visible(page, '.key[data-key="3"]')) === 1, `${T} · tout rangé : le pavé revient`);
    await shot(page, "16-partage-range"); await zonesOk(page, "le partage rangé");
    await typeIn(page, 3); await page.waitForTimeout(600);
    await q7(page); await page.waitForTimeout(400); check((await qid(page)) === "grp-03", `${T} · les groupes égaux`);
    await finPhrases(page); await page.waitForTimeout(300); await shot(page, "17-groupes-formes");
    await resetSaid(page); await typeIn(page, 7);
    await page.waitForFunction(() => window.__said.includes("10"), null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(200);
    await shot(page, "18-groupes-par-bonds");
    check(/5 \| 10/.test(await said(page)), `${T} · la correction compte par bonds (${(await said(page)).slice(0, 80)})`);
    await fermer(o, "le niveau 3");
  }

  // 6. les crans ; le coquillage au cran conseillé
  for (const cran of ["facile", "conseille", "dur", "tresdur"]) {
    const o = await open(`&choix=7:2&cran=${cran}&sans=echauffement&sansLecon&questions=2${cran === "tresdur" ? "" : "&enonce=reu-t-08"}`), { page } = o;
    await tap(page, ".play"); await q7(page); await finPhrases(page); await page.waitForTimeout(cran === "facile" ? 2500 : 400);
    const st = await page.evaluate(() => ({ coquillage: getComputedStyle(window.__app.facts.help).visibility, objets: !!window.__app.prob.objets, aide: !!window.__app.prob.aideVisible, d: window.__app.facts.q.e.difficulte, n: window.__app.facts.q.e.niveau }));
    if (cran === "facile") { check(st.objets && !st.aide, `${T} · « plus facile » : les données en objets, pas de schéma d'emblée`); await page.waitForFunction(() => window.__said.filter((t) => /\?$/.test(t)).length >= 2, null, { timeout: 30000 }).catch(() => {}); check((await page.evaluate(() => window.__said.filter((t) => /\?$/.test(t)).length)) >= 2, `${T} · « plus facile » : l'histoire redite`); await shot(page, "19-cran-facile"); }
    if (cran === "conseille") {
      check(st.coquillage === "visible" && !st.aide, `${T} · conseillé : le coquillage, pas de schéma d'emblée`);
      await tap(page, ".help", 1500); check(await page.evaluate(() => !!window.__app.prob.aideVisible), `${T} · le coquillage montre le schéma`);
      await shot(page, "20-coquillage"); await zonesOk(page, "le coquillage");
    }
    if (cran === "dur" || cran === "tresdur") check(st.coquillage === "hidden", `${T} · ${cran} : sans coquillage`);
    if (cran === "tresdur") { check(st.n === 6 && st.d === 3, `${T} · très dur : un énoncé de même structure une difficulté au-dessus (niveau ${st.n}, difficulté ${st.d})`); if (big) await shot(page, "21-cran-tres-dur"); }
    await fermer(o, `le cran ${cran}`);
  }

  // 7. la pause et la reprise : la maison pendant un problème, puis « continuer »
  {
    const o = await open("&choix=7:2&cran=conseille&sans=echauffement&sansLecon&questions=3&enonce=reu-t-08,reu-t-06"), { page } = o;
    await tap(page, ".play"); await q7(page); await finPhrases(page);
    await tap(page, ".session-home", 1200);
    check((await page.locator(".probleme-etiquette").count()) === 0 || (await visible(page, ".probleme-etiquette")) === 0, `${T} · la pause : plus d'étiquette à l'écran`);
    await shot(page, "22-pause");
    await resetSaid(page); await tap(page, ".play", 1500).catch(() => {});
    await q7(page, 30000).catch(() => {}); await page.waitForTimeout(800);
    check((await qid(page)) === "reu-t-08", `${T} · « continuer » : le même problème reposé (${await qid(page)})`);
    await shot(page, "23-reprise");
    await fermer(o, "la pause");
  }

  // 8. la leçon L19 depuis le menu
  if (big) {
    const o = await open(), { page } = o;
    await tap(page, ".leconskey"); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(700);
    await shot(page, "24-menu-lecons"); const b = await bulle(page); check(!b.couvre, `${T} · le menu des leçons : la bulle ne couvre aucune tuile`);
    await resetSaid(page); await tap(page, '.lecons-tuile[data-key="L19"]', 450); await tap(page, '.lecons-tuile[data-key="L19"]');
    await page.waitForFunction(() => window.__said.some((t) => /En dessous, les deux parties/.test(t)), null, { timeout: 60000 }).catch(() => {}); await page.waitForTimeout(700);
    await shot(page, "25-L19-schema");
    await page.waitForFunction(() => window.__said.some((t) => /il en reste 5 biscuits/.test(t)), null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(700);
    await shot(page, "26-L19-trouve");
    await page.waitForSelector(".lecons-atoi", { timeout: 120000 }); await page.waitForTimeout(700);
    await shot(page, "27-L19-a-toi"); await note(page, "la leçon L19");
    await tap(page, ".lecons-atoi"); await page.waitForSelector(".cran", { timeout: 20000 }).catch(() => {}); await tap(page, ".cran-ok").catch(() => {});
    await q7(page, 60000).catch(() => {}); check(await page.evaluate(() => window.__app.facts?.q?.module === 7 && window.__app.facts.q.niveau === 2), `${T} · « À toi ! » : les problèmes, niveau 2`);
    await fermer(o, "la leçon L19");
  }

  // 9. l'espace parent : le bloc du module 7, les réglages
  {
    const o = await open(), { page } = o;
    await page.evaluate(async () => { const { setProblemesLevel } = await import("./js/parent/depart.js"); await setProblemesLevel(window.__app.store, 3); await window.__app.store.add("reponses", { t: Date.now(), seance: 1, module: 7, niveau: 3, enonce: "par-v-01", question: "Combien de fraises chacun a-t-il ?", donnee: 4, attendue: 3, juste: false, erreur: "P3", tempsMs: 20000, ecoutes: 1, notion: true }); });
    await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
    page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
    for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
    await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(900);
    const has = await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].some((h) => /Module 7 · Les problèmes/.test(h.textContent)));
    check(has, `${T} · l'espace parent : le bloc « Module 7 · Les problèmes »`);
    await page.evaluate(() => [...document.querySelectorAll("h2")].find((h) => /Module 7/.test(h.textContent))?.scrollIntoView()); await page.waitForTimeout(300);
    await shot(page, "28-parent-module7");
    await page.click('.pa-tabs button:has-text("Réglages")').catch(() => {}); await page.waitForTimeout(700);
    const reg = await page.evaluate(() => ({ pb: document.body.innerText.includes("Problème du jour"), dep: !!document.querySelector('[aria-label="niveau des problèmes"]') }));
    check(reg.pb && reg.dep, `${T} · les réglages : « Problème du jour », le niveau de départ des problèmes`);
    await page.evaluate(() => [...document.querySelectorAll("*")].find((e) => e.children.length === 0 && /Problème du jour/.test(e.textContent))?.scrollIntoView()); await page.waitForTimeout(300);
    await shot(page, "29-parent-reglages");
    await fermer(o, "l'espace parent");
  }
}
if (journal.length) writeFileSync(join(OUT, "voix.json"), JSON.stringify(journal, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
