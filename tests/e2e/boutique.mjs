// LE PARCOURS DE LA BOUTIQUE DU RÉCIF (lot « La boutique du récif », docs/LOTS.md, fiche 10) dans Chromium, tactile, voix
// accélérée. Il passe par chaque situation nouvelle et en fait les captures, en 1280 × 800, 1920 × 1200 et 1138 × 711 densité
// 2,25 (la tablette) :
//  1. le récif et son bouton de la boutique (qui se balance quand un achat est possible) ;
//  2. la vitrine de chaque zone ; chaque état de place (à vendre, pas encore arrivée, dans le récif, brillante, légendaire,
//     légendaire du récif, zone fermée) et ce que dit la mascotte ;
//  3. la coche et la croix, en haut et en bas de la vitrine ; « il te manque » ;
//  4. l'achat, faire briller, une brillante par chance ; l'arrivée dans le récif ;
//  5. la fin de séance qui mène à la boutique, et celle qui mène au récif ; les arrivages de la semaine ; le coquillage de la
//     série, l'ouverture d'une zone et son premier habitant, l'étoile et le coquillage de diamant ; l'album des légendaires ;
//  6. l'espace parent ; la pause sans bouton de boutique ;
//  7. les situations à tenir : la coche touchée trois fois très vite (un seul achat), la page rechargée pendant le vol des
//     étoiles (débitées une fois), toucher deux fois une tuile n'achète rien, la croix et un toucher ailleurs annulent, pas de
//     coche sans assez d'étoiles, une sauvegarde d'avant la boutique.
// Captures dans tests/e2e/out/boutique/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/boutique.mjs [--out dossier] [--vite]   (--vite : seulement 1280 × 800)
import { chromium, finReelle, voixPermise } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/boutique")); mkdirSync(OUT, { recursive: true });
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))), T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const ids = (z, r = null) => cartes.cartes.filter((c) => c.zone === z && (r ? c.rarete === r : c.rarete !== "legendaire")).map((c) => c.id);
const lagon = ids("lagon"), corail = ids("corail"), large = ids("large");
// l'ordre de la vitrine (celui de l'album) : communes, rares, légendaires
const album = (z) => ["commune", "rare", "legendaire"].flatMap((r) => ids(z, r));
const prix = (id) => cartes.boutique.prix[cartes.cartes.find((c) => c.id === id).rarete];
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const Q = "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=2&guides=0";
const VUES = args.includes("--vite") ? [["1280", { width: 1280, height: 800 }, 1]] : [["1280", { width: 1280, height: 800 }, 1], ["1920", { width: 1920, height: 1200 }, 1], ["tablette", { width: 1138, height: 711 }, 2.25]];
const SEMAINE = 7 * 86400000;
// (le contenu fictif du grand large, pour les captures de son ouverture et du coquillage de diamant : ces phrases ne sont pas fabriquées)
voixPermise(/^Anecdote fictive pour la capture\.$/, ...cartes.cartes.filter((c) => !c.anecdote).map((c) => new RegExp(`^C.est ${c.nomLu.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} !$`)));

// une page neuve, un état posé dans la base (fiches du magasin « recompenses », réglages), puis rechargée
async function fresh(state, { q = Q, vue = VUES[0], reglages = {}, fin = false } = {}) {
  const context = await browser.newContext({ viewport: vue[1], deviceScaleFactor: vue[2], hasTouch: true });
  if (fin) await finReelle(context);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ([st, rg]) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put("recompenses", r); for (const [k, v] of Object.entries(rg)) await s.setSetting(k, v); }, [state, reglages]);
  await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { context, page };
}
const owned = (list, extra = {}) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false, ...extra }])) });
const etoiles = (total, extra = {}) => ({ id: "etoiles", total, cumul: total + 100, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0, ...extra });
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const saidReset = (page) => page.evaluate(() => { window.__said = []; window.__saidVu = 0; });
// un toucher au centre d'un élément (les boutons qui se balancent ne sont jamais « stables » pour Playwright)
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const tuile = (id) => `.boutique-tuile[data-id="${id}"]`;
const confVisible = (page) => page.evaluate(() => [...document.querySelectorAll(".boutique-conf")].map((b) => getComputedStyle(b).visibility === "visible"));
const vitrine = (page) => page.evaluate(() => Object.fromEntries(window.__app.boutique.vit));
// le récif, puis la boutique
async function boutique(page) {
  await tap(page, ".reefkey"); await recifOuvert(page);
  await page.waitForSelector(".boutique-cle", { timeout: 20000 });
  await tap(page, ".boutique-cle");
  await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 });
  await page.waitForTimeout(1600);
}
const zone = async (page, z) => { await tap(page, `.boutique-onglet[data-zone="${z}"]`); await page.waitForFunction((z) => window.__app.boutique.zone === z && document.querySelectorAll(".boutique-tuile").length === 15, z); await page.waitForTimeout(900); };
// chaque capture, avec ce que la voix a dit depuis la précédente et ce qu'écrit la bulle (pour la relecture : phrases.json)
const PHRASES = [];
const shot = async (page, vue, n) => {
  await page.screenshot({ path: join(OUT, `${n}-${vue[0]}.png`) });
  const r = await page.evaluate(() => { const s = window.__said ?? [], i = window.__saidVu ?? 0; window.__saidVu = s.length; return { dites: s.slice(i), bulle: window.__app.bulle.etat?.() ?? null }; }).catch(() => null);
  if (r) PHRASES.push({ capture: `${n}-${vue[0]}`, ...r });
};
process.on("exit", () => { try { writeFileSync(join(OUT, "phrases.json"), JSON.stringify(PHRASES, null, 1)); } catch { /* rien */ } });
const fini = (page) => page.waitForFunction(() => !window.__app.boutique.verrou, null, { timeout: 30000 });

// une situation de février : le lagon et le récif de corail (une créature sur quatre brillante), le grand large ouvert (son
// contenu fictif), 136 étoiles, une étoile de diamant ; une base d'arrivages qui fait arriver les créatures du grand large
const fevrier = (total = 136) => [owned([...lagon, ...corail].filter((_, i) => i % 9 !== 4)), etoiles(total, { dorees: 1 }), { id: "zones", ouvertes: ["lagon", "corail", "large"], dates: {} }, { id: "quota", date: Date.now() - 2 * SEMAINE, cartes: 34 }];
const brillantes = (st, list) => { const o = st.find((x) => x.id === "cartes"); for (const id of list) o.cartes[id].brillante = true; return st; };
const fictif = (page) => page.evaluate(() => { for (const c of window.__app.cartes.cartes) if (c.zone === "large") { c.anecdote ??= "Anecdote fictive pour la capture."; c.illustration ??= "assets/cards/fictive.webp"; } });

// ---------------------------------------------------------------- 1 à 4 : les captures de chaque situation, dans chaque vue
for (const vue of VUES) {
  // 1. le récif et la vitrine du lagon : 6 créatures (2 brillantes), 230 étoiles, la base posée il y a 4 semaines (8 arrivées)
  {
    const { context, page } = await fresh([brillantes([owned(lagon.slice(0, 6)), etoiles(230), { id: "quota", date: Date.now() - 3 * SEMAINE, cartes: 2 }], [lagon[1], lagon[4]])].flat(), { vue });
    await tap(page, ".reefkey"); await recifOuvert(page); await page.waitForSelector(".boutique-cle");
    await shot(page, vue, "01-recif-bouton");
    if (vue[0] === "1280") check(await page.evaluate(() => document.querySelector(".boutique-cle").classList.contains("invite")), "récif : le bouton de la boutique se balance (un achat est possible)");
    await tap(page, ".boutique-cle");
    await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 }); await page.waitForTimeout(2200);
    await shot(page, vue, "02-vitrine-lagon");
    const v = await vitrine(page), n = (e) => Object.values(v).filter((x) => x === e).length;
    if (vue[0] === "1280") {
      check(n("terne") === 4 && n("brillante") === 2 && n("vendre") >= 2 && n("bientot") >= 1, `vitrine du lagon : 4 dans le récif, 2 brillantes, ${n("vendre")} à vendre, ${n("bientot")} pas encore arrivées`);
      check((await said(page)).includes(T.boutique.bienvenue) && (await said(page)).includes(T.boutique.consigne), "première visite : « Bienvenue à la boutique ! » puis la consigne");
    }
    // la coche et la croix, en haut (sous la tuile)
    const aVendre = Object.keys(v).filter((k) => v[k] === "vendre"), terne = Object.keys(v).find((k) => v[k] === "terne"), bientot = Object.keys(v).find((k) => v[k] === "bientot"), brill = Object.keys(v).find((k) => v[k] === "brillante");
    await saidReset(page); await tap(page, tuile(aVendre[0])); await page.waitForTimeout(1800);
    await shot(page, vue, "03-coche-et-croix-haut");
    if (vue[0] === "1280") {
      const [cx, ok] = await confVisible(page), t = await page.locator(tuile(aVendre[0])).boundingBox(), c = await page.locator(".boutique-conf.coche").boundingBox();
      check(cx && ok && c.y > t.y + t.height - 4, "à vendre, assez d'étoiles : la croix et la coche sous la tuile");
      check(c.width >= 64 && c.height >= 64, `la coche fait au moins 64 px (${Math.round(c.width)})`);
      check(new RegExp(`C'est .* ! Pour l'avoir, il faut ${prix(aVendre[0])} étoiles\\. Si tu es d'accord, touche la coche verte\\.`).test(await said(page)), `la mascotte dit le prix (${await said(page)})`);
    }
    // un deuxième toucher sur la même tuile n'achète rien
    const total0 = await page.evaluate(() => window.__app.rewards.total);
    await tap(page, tuile(aVendre[0])); await page.waitForTimeout(700);
    if (vue[0] === "1280") check((await page.evaluate(() => [window.__app.rewards.total, window.__app.rewards.achats.liste.length])).join() === `${total0},0`, "toucher deux fois une tuile n'achète rien");
    // la croix annule
    await tap(page, ".boutique-conf.croix"); await page.waitForTimeout(500);
    if (vue[0] === "1280") check((await confVisible(page)).every((x) => !x) && !(await page.evaluate(() => window.__app.boutique.sel)), "la croix annule (plus de sélection, ni coche ni croix)");
    // la coche et la croix en bas : une créature du récif sur la dernière rangée (faire briller)
    const bas = lagon.slice(10).find((id) => v[id] === "terne") ?? terne;
    await tap(page, tuile(terne)); await page.waitForTimeout(400);
    // un toucher ailleurs annule
    await page.touchscreen.tap(Math.round(vue[1].width * 0.12), Math.round(vue[1].height * 0.92)); await page.waitForTimeout(400);
    if (vue[0] === "1280") check(!(await page.evaluate(() => window.__app.boutique.sel)), "un toucher ailleurs annule");
    // (pas de créature du récif sur la dernière rangée dans cette situation : on en pose une, le temps de la capture)
    const rareBas = album("lagon")[14];
    await page.evaluate((id) => { const b = window.__app.boutique; b.vit.set(id, "terne"); window.__app.rewards.owned[id] = { n: 1, premiere: 1, brillante: false }; const t = document.querySelector(`.boutique-tuile[data-id="${id}"]`); t.repaint(); b.decorer(t); }, rareBas);
    await saidReset(page); await tap(page, tuile(rareBas)); await page.waitForTimeout(1800);
    await shot(page, vue, "04-coche-et-croix-bas");
    if (vue[0] === "1280") {
      const t = await page.locator(tuile(rareBas)).boundingBox(), c = await page.locator(".boutique-conf.coche").boundingBox();
      check(c.y + c.height < t.y + t.height && c.y + c.height <= 800, "dernière rangée : la coche et la croix au-dessus du bas de l'écran");
      check(/est déjà dans ton récif\. Pour la faire briller, il faut 300 étoiles\. Il te manque 70 étoiles\./.test(await said(page)), `une rare du récif : le prix pour briller, et ce qui manque (${await said(page)})`);
      check((await confVisible(page)).every((x) => !x), "pas assez d'étoiles : ni coche ni croix");
    }
    void bas;
    await shot(page, vue, "05-il-te-manque");
    // les autres états : pas encore arrivée, brillante
    await saidReset(page); await tap(page, tuile(bientot)); await page.waitForTimeout(1600); await shot(page, vue, "06-pas-encore-arrivee");
    if (vue[0] === "1280") check((await said(page)).includes(T.boutique.bientot) && (await confVisible(page)).every((x) => !x), "pas encore arrivée : « Cette créature arrive bientôt à la boutique ! », pas de coche");
    await saidReset(page); await tap(page, tuile(brill)); await page.waitForTimeout(1600); await shot(page, vue, "07-brillante");
    if (vue[0] === "1280") check((await said(page)).includes(T.boutique.brilleDeja), "brillante : « Cette créature brille déjà dans ton récif. »");
    // L'ACHAT : les étoiles volent, la créature sort au milieu, puis file vers le récif
    await tap(page, tuile(aVendre[1])); await page.waitForTimeout(500);
    await page.evaluate(() => { window.__app.rnd = () => 0.9; }); // (pas brillante)
    // (le compteur, relevé toutes les 40 ms pendant le vol : il doit passer par des valeurs intermédiaires)
    await page.evaluate(() => { window.__cpt = []; const t0 = performance.now(), f = () => { window.__cpt.push(window.__app.hud.shown); if (performance.now() - t0 < 2500) setTimeout(f, 40); }; f(); });
    await tap(page, ".boutique-conf.coche"); await page.waitForTimeout(500);
    const total1 = await page.evaluate(() => window.__app.rewards.total);
    await shot(page, vue, "08-achat-vol-des-etoiles");
    if (vue[0] === "1280") {
      await page.waitForTimeout(2100);
      const cpt = await page.evaluate(() => window.__cpt), inter = [...new Set(cpt.filter((v) => v < 230 && v > total1))];
      check(total1 === 230 - prix(aVendre[1]) && inter.length >= 2 && cpt.every((v, i) => !i || v <= cpt[i - 1]), `l'achat est enregistré avant l'animation (${total1}), le compteur descend avec les étoiles, jamais d'un coup (${[230, ...inter, total1].join(" → ")})`);
    }
    await page.waitForSelector(".boutique-voile.on", { timeout: 10000 }); await page.waitForTimeout(900);
    await shot(page, vue, "09-achat-milieu");
    await fini(page); await page.waitForTimeout(400);
    await shot(page, vue, "10-achat-fin");
    if (vue[0] === "1280") check((await vitrine(page))[aVendre[1]] === "terne" && (await page.evaluate(() => window.__app.hud.shown)) === 230 - prix(aVendre[1]), `après l'achat : la créature est dans le récif, le compteur montre ${230 - prix(aVendre[1])}`);
    // une brillante par chance
    await page.evaluate(() => window.__app.rewards.add(200));
    const prochaine = Object.entries(await vitrine(page)).find(([, e]) => e === "vendre")?.[0];
    if (prochaine) {
      await tap(page, tuile(prochaine)); await page.waitForTimeout(400);
      await page.evaluate(() => { window.__app.rnd = () => 0.01; });
      await tap(page, ".boutique-conf.coche"); await page.waitForSelector(".boutique-voile.on", { timeout: 10000 }); await page.waitForTimeout(1600);
      await shot(page, vue, "11-brillante-par-chance");
      if (vue[0] === "1280") check((await page.evaluate((id) => window.__app.rewards.owned[id].brillante, prochaine)) && (await said(page)).includes("Oh ! Elle est brillante !"), "une créature achetée sort brillante (tirage forcé) : « Oh ! Elle est brillante ! »");
      await fini(page);
    }
    // faire briller
    const aBriller = Object.entries(await vitrine(page)).find(([id, e]) => e === "terne" && cartes.cartes.find((c) => c.id === id).rarete === "commune")[0];
    await saidReset(page); await tap(page, tuile(aBriller)); await page.waitForTimeout(400);
    const avant = await page.evaluate(() => window.__app.rewards.total);
    await tap(page, ".boutique-conf.coche"); await page.waitForTimeout(1900);
    await shot(page, vue, "12-faire-briller");
    await fini(page);
    if (vue[0] === "1280") check((await page.evaluate((id) => [window.__app.rewards.owned[id].brillante, window.__app.rewards.total], aBriller)).join() === `true,${avant - 150}` && (await said(page)).includes("Oh ! Elle est brillante !"), "faire briller : 150 étoiles, la créature brille, « Oh ! Elle est brillante ! »");
    // l'arrivée dans le récif : la dernière créature achetée (pas celle qu'on a fait briller) nage jusqu'à sa place
    await page.evaluate(() => { window.__app.rewards.arrivee = { id: window.__app.rewards.achats.liste.filter((a) => !a.briller).at(-1).carte, briller: false }; });
    await tap(page, ".boutique-retour"); await recifOuvert(page, 30000).catch(() => {});
    await page.waitForTimeout(200); await shot(page, vue, "13-arrivee-recif-a");
    await page.waitForTimeout(1300); await shot(page, vue, "14-arrivee-recif-b");
    if (vue[0] === "1280") check(await page.evaluate(() => !!window.__app.reef.arr), "récif : la créature achetée arrive à la nage, avec son halo");
    await context.close();
  }
  // 2. les vitrines des autres zones, les légendaires
  {
    const st = brillantes(fevrier(), [corail[2], lagon[0]]);
    const { context, page } = await fresh(st, { vue });
    await fictif(page);
    await boutique(page);
    await shot(page, vue, "15-vitrine-arrivees");
    await zone(page, "corail"); await shot(page, vue, "16-vitrine-corail");
    await zone(page, "large"); await shot(page, vue, "17-vitrine-grand-large");
    const leg = cartes.cartes.find((c) => c.zone === "large" && c.rarete === "legendaire").id;
    await saidReset(page); await tap(page, tuile(leg)); await page.waitForTimeout(1800); await shot(page, vue, "18-legendaire");
    if (vue[0] === "1280") check((await said(page)).includes(T.boutique.legendaire) && (await confVisible(page)).every((x) => !x), "légendaire : « C'est une créature légendaire ! Elle se gagne avec les étoiles de diamant. », pas de coche");
    await zone(page, "abysses"); await saidReset(page);
    await tap(page, tuile(ids("abysses")[0])); await page.waitForTimeout(1800); await shot(page, vue, "19-zone-fermee");
    if (vue[0] === "1280") check((await said(page)).includes(cartes.zones[3].fermeeLu) && (await confVisible(page)).every((x) => !x), "zone fermée : la phrase de la zone, pas de coche");
    await context.close();
  }
  // 3. la zone complète : « Tu as toutes les créatures de cette zone ! Une nouvelle zone va bientôt s'ouvrir. »
  {
    const { context, page } = await fresh([owned(lagon.slice(0, 14)), etoiles(150), { id: "quota", date: Date.now() - 10 * SEMAINE, cartes: 15 }], { vue });
    await boutique(page);
    const last = lagon[14];
    await tap(page, tuile(last)); await page.waitForTimeout(400); await saidReset(page);
    await page.evaluate(() => { window.__app.rnd = () => 0.9; });
    await tap(page, ".boutique-conf.coche"); await fini(page); await page.waitForTimeout(1500);
    await shot(page, vue, "20-zone-complete");
    if (vue[0] === "1280") check((await said(page)).includes(`${T.boutique.zoneFinie} ${T.boutique.zoneBientot}`), "la zone complète : « Tu as toutes les créatures de cette zone ! Une nouvelle zone va bientôt s'ouvrir. »");
    await context.close();
  }
}

// ---------------------------------------------------------------- 5. la fin de séance
// joue la séance jusqu'au bouton de fin (ou « à demain ») ; touche chaque coquillage et chaque coche ; `vu(n)` : une capture
async function jouer(page, { vu = async () => {} } = {}) {
  await tap(page, ".play");
  for (const until = Date.now() + 180000; Date.now() < until;) {
    const st = await page.evaluate(() => { const s = window.__app.screen; return { q: s?.q && !s.locked && s.resolve ? s.q.answer : null, f: s?.q?.format, shell: !!document.querySelector(".shelltap"), check: !!document.querySelector(".check"), card: !!document.querySelector(".card.flipped"), fin: !!document.querySelector(".fin-recompense"), moon: !!document.querySelector(".moon"), special: !!document.querySelector(".special"), mini: !!document.querySelector(".boutique-mini"), zone: !!document.querySelector(".card.zone-closed") }; });
    if (st.fin || st.moon) return st;
    if (st.q !== null) { if (st.f === "lire" || st.f === "sauter") await page.tap(`.answer[data-value="${st.q}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); await page.waitForTimeout(200); continue; }
    if (st.special) await vu("special");
    if (st.mini) await vu("mini");
    if (st.zone) await vu("zone");
    if (st.shell) { await page.waitForTimeout(900); await vu("coquillage"); await page.tap(".shelltap", { force: true }); await page.waitForTimeout(300); continue; }
    if (st.card && st.check) { await page.waitForTimeout(1300); await vu("carte"); await page.tap(".check", { force: true }); await page.waitForTimeout(800); continue; }
    await page.waitForTimeout(150);
  }
  throw new Error("la séance ne s'est pas terminée");
}
const vue0 = VUES[0];
{
  // a. un achat possible (120 étoiles), des arrivées pas encore annoncées : les arrivages, l'invitation, le bouton vers la boutique
  const { context, page } = await fresh([owned(lagon.slice(0, 3)), etoiles(120), { id: "quota", date: Date.now() - SEMAINE, cartes: 3 }], { fin: true });
  const vus = new Set();
  const st = await jouer(page, { vu: async (k) => { if (k === "mini" && !vus.has(k)) { vus.add(k); await page.waitForTimeout(500); await shot(page, vue0, "21-fin-arrivages"); } } });
  await page.waitForTimeout(600); await shot(page, vue0, "22-fin-vers-boutique");
  check(st.fin && await page.evaluate(() => document.querySelector(".fin-recompense").classList.contains("vers-boutique")), "fin de séance, un achat possible : le bouton mène à la boutique");
  const s = await said(page);
  check(s.includes(T.boutique.arrivees) && s.includes(T.boutique.invitation), "la récompense annonce les arrivées puis invite à la boutique");
  check(vus.has("mini"), "les créatures arrivées cette semaine sont montrées");
  await tap(page, ".fin-recompense");
  await page.waitForFunction(() => window.__app.boutique.open && document.querySelectorAll(".boutique-tuile").length === 15, null, { timeout: 30000 }); await page.waitForTimeout(1500);
  await shot(page, vue0, "23-fin-boutique-ouverte");
  check(!(await said(page)).includes(T.boutique.arrivees + " | " + T.boutique.arrivees), "les arrivées déjà annoncées ne le sont plus à l'entrée de la boutique");
  await tap(page, ".boutique-retour"); await recifOuvert(page);
  await tap(page, ".homekey:not(.session-home)"); await page.waitForSelector(".moon", { timeout: 20000 }); await page.waitForTimeout(800);
  await shot(page, vue0, "24-a-demain-apres-la-boutique");
  check((await page.locator(".moon").count()) === 1 && (await page.locator(".boutique-cle").count()) === 0, "retour du récif : « à demain », sans bouton de boutique à l'accueil");
  await context.close();
}
{
  // b. rien à acheter (5 étoiles) : le bouton mène au récif
  const { context, page } = await fresh([owned(lagon.slice(0, 2)), etoiles(0), { id: "quota", date: Date.now() - 3600000, cartes: 2 }, { id: "boutique", annoncees: lagon, vues: lagon, visites: 3 }], { fin: true });
  await page.evaluate(() => { window.__app.rewards.add = (() => { const a = window.__app.rewards.add.bind(window.__app.rewards); return (n, r) => a(Math.min(n, 1), r); })(); });
  const st = await jouer(page);
  await page.waitForTimeout(600); await shot(page, vue0, "25-fin-vers-recif");
  check(st.fin && await page.evaluate(() => document.querySelector(".fin-recompense").classList.contains("vers-recif")), `fin de séance, rien à acheter (${await page.evaluate(() => window.__app.rewards.total)} étoiles) : le bouton mène au récif`);
  await tap(page, ".fin-recompense"); await recifOuvert(page);
  check(await page.evaluate(() => window.__app.reef.open), "le bouton de fin ouvre le récif");
  await context.close();
}
{
  // c. le coquillage de la série (la 10e séance), l'étoile de diamant (la 4e semaine réussie), l'ouverture du grand large et son
  // premier habitant, le coquillage de diamant (contenu fictif du grand large)
  const D = Date.now(), lundi = (() => { const d = new Date(D); d.setHours(10, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })();
  // trois semaines réussies avant celle-ci, et une séance déjà faite cette semaine (si elle a commencé avant aujourd'hui)
  const seances = [1, 2, 3].flatMap((k) => [lundi - k * SEMAINE, lundi - k * SEMAINE + 86400000]).map((t) => ({ debut: t, terminee: true, etapes: [] }));
  const cetteSemaine = D - lundi > 86400000 ? [{ debut: lundi, terminee: true, etapes: [] }] : [];
  const st = [owned([...lagon, ...corail, ...large.slice(0, 13)]), etoiles(20, { arcEnCiel: 3, arcDepensees: 1 }), { id: "zones", ouvertes: ["lagon", "corail"], dates: {} }, { id: "serie", seances: 9, derniere: D - 86400000 }, { id: "quota", date: D - 30 * SEMAINE, cartes: 0 }];
  const { context, page } = await fresh(st, { fin: true });
  await page.evaluate(async (ss) => { for (const s of ss) await window.__app.store.add("seances", s); }, [...seances, ...cetteSemaine]);
  await page.route("**/fictive.webp", (r) => r.fulfill({ status: 200, contentType: "image/webp", body: "" }));
  // (le grand large prêt, ses communes sauf une dans le récif : son ouverture offre la dernière)
  await page.evaluate(() => { for (const c of window.__app.cartes.cartes) if (c.zone === "large" || c.zone === "abysses") { c.anecdote ??= "Anecdote fictive pour la capture."; c.illustration ??= "assets/cards/fictive.webp"; } });
  await page.evaluate((ids) => { const r = window.__app.rewards; r.owned = Object.fromEntries(Object.entries(r.owned).filter(([k]) => !ids.includes(k))); }, large);
  const vus = new Map();
  const res = await jouer(page, { vu: async (k) => { const n = (vus.get(k) ?? 0) + 1; vus.set(k, n); if (n <= 3) await shot(page, vue0, `26-fin-${k}-${n}`); } });
  void res;
  const s = await said(page), rec = await page.evaluate(() => window.__app.session.rec);
  check(s.includes(T.coquillageSerie), "la 10e séance de la série : « Tu viens jouer souvent : voici un coquillage ! »");
  check(s.includes("Et une étoile de diamant !") || cetteSemaine.length === 0, `l'étoile de diamant de la 4e semaine réussie${cetteSemaine.length ? "" : " (cette semaine commence aujourd'hui : non vérifié)"}`);
  check((rec.zones ?? []).includes("large") && s.includes(T.premierHabitant), "le grand large s'ouvre et offre son premier habitant : « Et voici son premier habitant ! »");
  const hab = await page.evaluate(() => Object.entries(window.__app.rewards.owned).find(([, o]) => o.origine === "zone")?.[0]);
  check(!!hab && cartes.cartes.find((c) => c.id === hab).rarete === "commune", `le premier habitant est une commune du grand large (${hab})`);
  await context.close();
}
{
  // d. le coquillage de diamant : une étoile de diamant en réserve, le grand large complet (contenu fictif)
  const { context, page } = await fresh([owned([...lagon, ...corail, ...large]), etoiles(0, { dorees: 1 }), { id: "zones", ouvertes: ["lagon", "corail", "large"], dates: {} }, { id: "quota", date: Date.now() - 30 * SEMAINE, cartes: 0 }], { fin: true });
  await page.route("**/fictive.webp", (r) => r.fulfill({ status: 200, contentType: "image/webp", body: "" }));
  await page.evaluate(() => { for (const c of window.__app.cartes.cartes) if (c.zone === "large") { c.anecdote ??= "Anecdote fictive pour la capture."; c.illustration ??= "assets/cards/fictive.webp"; } });
  voixPermise(/^C.est le grand requin blanc !$/);
  let n = 0;
  await jouer(page, { vu: async (k) => { if ((k === "coquillage" || k === "carte") && n++ < 2) await shot(page, vue0, `27-coquillage-de-diamant-${n}`); } });
  const s = await said(page);
  check(s.includes(T.coquillageDore) && (await page.evaluate(() => window.__app.session.rec.coquillageDore)) === "grand-requin-blanc", "« Ton étoile de diamant ouvre un coquillage de diamant ! » : le grand requin blanc");
  await context.close();
}
{
  // e. l'album des légendaires : le dos porte l'étoile de diamant
  const { context, page } = await fresh([owned([...lagon, ...corail]), etoiles(10), { id: "zones", ouvertes: ["lagon", "corail", "large"], dates: {} }]);
  await tap(page, ".albumkey"); await page.waitForSelector(".album-card", { timeout: 20000 }); await page.waitForTimeout(800);
  await tap(page, ".album-tab >> nth=2"); await page.waitForTimeout(1200); await saidReset(page);
  const dos = page.locator(".album-card.back").last(); await dos.tap({ force: true }); await page.waitForTimeout(1500);
  await shot(page, vue0, "28-album-legendaires");
  check((await said(page)).includes(cartes.legendaireLu), "album : le dos d'une légendaire dit « …Elle se gagne avec les étoiles de diamant. »");
  await context.close();
}

// ---------------------------------------------------------------- 6. l'espace parent ; la pause
{
  // (un état cohérent : les deux créatures brillantes sont celles du journal, une étoile de diamant gagnée et pas encore dépensée)
  const o9 = owned(lagon.slice(0, 9)); o9.cartes[lagon[8]].brillante = true; o9.cartes[lagon[0]].brillante = true;
  const { context, page } = await fresh([o9, etoiles(57, { dorees: 1, doreesDepensees: 0 }), { id: "quota", date: Date.now() - 3 * SEMAINE, cartes: 6 }, { id: "achats", liste: [{ t: Date.now() - 86400000 * 3, carte: lagon[7], prix: 40, briller: false, brillante: false }, { t: Date.now() - 86400000, carte: lagon[8], prix: 40, briller: false, brillante: true }, { t: Date.now() - 3600000, carte: lagon[0], prix: 150, briller: true, brillante: true }] }]);
  await page.evaluate(async () => { const p = window.__app.parent; p.tab = "progression"; p.open(); await p.dashboard(); });
  await page.waitForTimeout(500);
  const box = page.locator(".pa-card-box", { has: page.locator("h2", { hasText: /^Cartes et boutique$/ }) });
  check(await box.count() === 1, "espace parent : le bloc « Cartes et boutique »");
  await box.scrollIntoViewIfNeeded(); await box.screenshot({ path: join(OUT, "29-parent-cartes-et-boutique.png") });
  const t = await box.textContent();
  check(/étoiles de diamant en réserve/.test(t) && /faire briller/.test(t) && /230 étoiles dépensées/.test(t) && !/dorée/.test(t), "le bloc liste les achats et dit « étoiles de diamant »");
  await page.evaluate(async () => { const p = window.__app.parent; p.tab = "donnees"; await p.dashboard(); });
  await page.waitForTimeout(400);
  const row = page.locator(".pa-setting", { hasText: "Rythme de la boutique" });
  check(await row.count() === 1, "réglages : le rythme de la boutique");
  await row.scrollIntoViewIfNeeded(); await row.screenshot({ path: join(OUT, "30-parent-rythme.png") });
  await row.locator('button[data-v="libre"]').click(); await page.waitForTimeout(300);
  check((await page.evaluate(() => window.__app.store.setting("boutiqueRythme"))) === "libre" && (await page.evaluate(() => window.__app.rewards.mode)) === "libre", "le rythme passe à « libre »");
  check(await page.locator('[data-export="achats"]').count() === 1, "données : l'export des achats");
  await context.close();
}
{
  const { context, page } = await fresh([owned(lagon.slice(0, 4)), etoiles(300), { id: "quota", date: Date.now() - 3 * SEMAINE, cartes: 2 }]);
  await tap(page, ".play");
  await page.waitForFunction(() => window.__app.session?.progress?.etape === "notion" && document.querySelector(".session-home")?.style.visibility === "visible", null, { timeout: 60000 });
  await page.waitForTimeout(800); await tap(page, ".session-home"); await page.waitForSelector(".reefkey.keep", { timeout: 20000 }); await page.waitForTimeout(600);
  await tap(page, ".reefkey.keep"); await recifOuvert(page); await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "31-pause-recif-sans-boutique.png") });
  check((await page.locator(".boutique-cle").count()) === 0, "pendant une séance en pause : pas de bouton de la boutique dans le récif");
  await context.close();
}

// ---------------------------------------------------------------- 7. les situations à tenir
{
  // la coche touchée trois fois très vite : un seul achat
  const { context, page } = await fresh([owned(lagon.slice(0, 2)), etoiles(400), { id: "quota", date: Date.now() - 3600000, cartes: 6 }, { id: "boutique", annoncees: lagon, vues: lagon, visites: 1 }]);
  await boutique(page);
  const id = Object.entries(await vitrine(page)).find(([, e]) => e === "vendre")[0];
  await tap(page, tuile(id)); await page.waitForTimeout(300);
  const c = await page.locator(".boutique-conf.coche").boundingBox();
  for (let i = 0; i < 3; i++) await page.touchscreen.tap(c.x + c.width / 2, c.y + c.height / 2);
  await fini(page);
  const r = await page.evaluate(async () => ({ total: window.__app.rewards.total, achats: (await window.__app.store.get("recompenses", "achats")).liste.length }));
  check(r.total === 400 - prix(id) && r.achats === 1, `la coche touchée trois fois très vite : un seul achat (${r.achats}), ${prix(id)} étoiles débitées (${r.total})`);
  // la page rechargée pendant le vol des étoiles : la créature est achetée, les étoiles débitées une seule fois
  const id2 = Object.entries(await vitrine(page)).find(([, e]) => e === "vendre")[0];
  await tap(page, tuile(id2)); await page.waitForTimeout(300); await tap(page, ".boutique-conf.coche"); await page.waitForTimeout(250);
  await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
  const r2 = await page.evaluate(async () => ({ total: (await window.__app.store.get("recompenses", "etoiles")).total, cartes: (await window.__app.store.get("recompenses", "cartes")).cartes, achats: (await window.__app.store.get("recompenses", "achats")).liste.length }));
  check(r2.total === 400 - prix(id) - prix(id2) && !!r2.cartes[id2] && r2.achats === 2, `la page rechargée pendant le vol : achetée et débitée une fois (${r2.total} étoiles, ${r2.achats} achats)`);
  // la maison du récif pendant l'animation : rien n'est perdu, rien n'est refait
  await boutique(page);
  const id3 = Object.entries(await vitrine(page)).find(([, e]) => e === "vendre")?.[0];
  check(!!id3, "une troisième créature à vendre (pour le retour au récif pendant le vol)");
  if (id3) {
    await tap(page, tuile(id3)); await page.waitForTimeout(300); await tap(page, ".boutique-conf.coche"); await page.waitForTimeout(300);
    await tap(page, ".boutique-retour"); await recifOuvert(page);
    const r3 = await page.evaluate(() => [window.__app.rewards.total, window.__app.hud.shown, document.querySelectorAll(".boutique-vol, .boutique-voile").length]);
    check(r3[0] === 400 - prix(id) - prix(id2) - prix(id3) && r3[1] === r3[0] && r3[2] === 0, `le retour au récif pendant le vol : achetée une fois (${r3[0]}), compteur juste (${r3[1]}), rien ne reste à l'écran`);
  }
  check(await page.evaluate(() => window.__app.rewards.total >= 0), "le compteur n'est jamais négatif");
  await context.close();
}
{
  // une sauvegarde de la version d'avant la boutique : la vitrine s'ouvre dessus, avec la bonne vitrine
  const gagnees = [lagon[0], lagon[3], lagon[5], lagon[7], lagon[9], lagon[11], lagon[12], lagon[14]];
  const o = owned(gagnees); o.cartes[lagon[3]].brillante = true; o.cartes[lagon[12]].brillante = true;
  const { context, page } = await fresh([o, etoiles(187, { coquillages: 8, dorees: 1 }), { id: "serie", seances: 17, derniere: Date.now() - 86400000 }, { id: "quota", date: Date.now() - 4 * SEMAINE, cartes: 0 }, { id: "zones", ouvertes: ["lagon"], dates: {} }, { id: "cadeaux", liste: ["algue"] }]);
  await boutique(page);
  const v = await vitrine(page), n = (e) => Object.values(v).filter((x) => x === e).length, N = await page.evaluate(() => window.__app.rewards.nbArrivees());
  await shot(page, vue0, "32-sauvegarde-ancienne");
  check(n("terne") === 6 && n("brillante") === 2 && n("vendre") === Math.max(0, Math.min(15, N) - 8) && n("vendre") + n("bientot") === 7, `sauvegarde d'avant la boutique : 8 créatures (2 brillantes), ${n("vendre")} à vendre (${N} arrivées), ${n("bientot")} à venir, 187 étoiles dépensables`);
  check((await page.evaluate(() => window.__app.hud.shown)) === 187, "le compteur montre les 187 étoiles accumulées");
  await context.close();
}

check(errors.length === 0, `aucune erreur dans la page${errors.length ? ` : ${errors.join(" | ")}` : ""}`);
await browser.close(); srv.close();
