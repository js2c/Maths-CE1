// LOT « CORRECTIFS DU 5 NOVEMBRE » (docs/LOTS.md, fiche 22 ; constats et décisions du parent du 5 novembre 2026) : le parcours du
// lot. Il passe par chaque situation nouvelle et en fait les captures (1280 × 800, 1920 × 1200, la tablette de référence s5e, le
// petit smartphone) :
//  1. l'accueil à quatre galets (et l'accueil en pause), sans galet de l'album, dans l'écran, sans se toucher ;
//  2. les trois compteurs sur une seule ligne : chaque étoile à gauche de son nombre, même taille, même hauteur ; le diamant à 0 ;
//     la phrase du diamant à 0 ;
//  3. le récif : les compteurs (sur leur plaque, sans toucher), la petite tête de la mascotte qui redit la consigne, l'album par le
//     livre ;
//  4. la boutique pendant une séance en pause : un achat, puis « continuer » reprend exactement (même question, même consigne, mêmes
//     réponses et étoiles de la séance, même étape) ;
//  5. la musique (avec le son) : au toucher de l'écran de démarrage, l'ambiance ; « jouer », la musique de la séance, en fondu
//     enchaîné, sans trou (la puissance relevée toutes les 50 ms) ; la séance finie, l'ambiance revient ; l'espace parent se tait ;
//     la musique coupée puis rallumée par le parent ; une séance reprise après un rechargement commence avec sa propre musique.
// Captures dans tests/e2e/out/correctifs-5-novembre/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/correctifs-5-novembre.mjs [--vite] [--musique]   (--vite : seulement 1280 × 800 ; --musique : la partie 5 seule)
// BANC ANDROID, raccourcis : voix rapide, sans service worker
// (raison : chaque situation part d'une base neuve ; à la vitesse réelle de la voix le parcours durerait plusieurs fois plus longtemps,
// et installer l'application pour chacune n'apporterait rien à ce qu'il vérifie. Le son, lui, est gardé pour la partie 5 : c'est
// elle qui l'éprouve. La vraie voix et l'application installée sont éprouvées par journee.mjs, enfant.mjs --android, installation.mjs.)
// (sans le problème du jour, `sans=probleme` : il n'est pas l'objet de ce parcours)
import { chromium, demarrageReel } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { ilYaSemaines, recifOuvert } from "./recif-commun.mjs";
import { optionsProfil } from "./appareils.mjs";
import { REPONDRE } from "./jeu.mjs";

const args = process.argv.slice(2);
const OUT = resolve("tests/e2e/out/correctifs-5-novembre"); mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url), "utf8")), SON = JSON.parse(readFileSync(new URL("../../app/content/son.json", import.meta.url), "utf8"));
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url), "utf8"));
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const errors = [], fail = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) fail.push(msg); };
const Q = "?nosw&voix=rapide&sans=probleme&sansReprise";
const VUES = args.includes("--vite") ? [["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }]]
  : [["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }], ["1920", { viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1, hasTouch: true }], ["s5e", optionsProfil("s5e")], ["petit-smartphone", optionsProfil("petit-smartphone")]];
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
const etoiles = (total, arc = 0, dorees = 0) => ({ id: "etoiles", total, cumul: total + 400, dorees, doreesDepensees: 0, arcEnCiel: arc + 1, arcDepensees: 1, arcBrillees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });

async function ouvrir(vue, etat = [], q = Q, { reel = false } = {}) {
  const context = await browser.newContext(vue[1]);
  if (reel) await demarrageReel(context);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined || !!document.querySelector(".demarrage"), null, { timeout: 60000 });
  await page.waitForFunction(() => !!window.__app?.store, null, { timeout: 60000 });
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put("recompenses", r); }, etat);
  await page.goto(url + q);
  if (!reel) await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  return { context, page };
}
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const shot = async (page, vue, nom, ms = 500) => { await page.waitForTimeout(ms); await page.screenshot({ path: join(OUT, `${nom}-${vue[0]}.png`) }); };
const boites = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.checkVisibility({ visibilityProperty: true }) && !e.closest(".stash")).map((e) => { const r = e.getBoundingClientRect(), k = document.querySelector("#ui").getBoundingClientRect().width / 1280; return { x: (r.x - document.querySelector("#ui").getBoundingClientRect().x) / k, y: (r.y - document.querySelector("#ui").getBoundingClientRect().y) / k, w: r.width / k, h: r.height / k, cls: e.className }; }), sel);
// la rangée des compteurs : trois cases sur une ligne, sans chevauchement, entre la frise et le bord, cibles de 64 px
const rangee = async (page, vue, ou) => {
  const b = [...(await boites(page, ".hud.stars")), ...(await boites(page, ".reserve.arc")), ...(await boites(page, ".reserve.diamant"))];
  check(b.length === 3, `${vue[0]} ${ou} : trois compteurs (étoiles de mer, arc-en-ciel, diamant ; le diamant même à 0)`);
  if (b.length !== 3) return;
  check(b.every((x) => Math.abs(x.y - b[0].y) < 1 && Math.abs(x.h - b[0].h) < 1), `${vue[0]} ${ou} : sur une seule ligne, à la même hauteur`);
  check(b.every((x, i) => !i || x.x >= b[i - 1].x + b[i - 1].w - 0.5) && b[0].x >= 950 && b[2].x + b[2].w <= 1280, `${vue[0]} ${ou} : de gauche à droite, sans se chevaucher, entre la frise et le bord (${b.map((x) => Math.round(x.x)).join(", ")})`);
  check(b.slice(1).every((x) => x.w >= 64 && x.h >= 64), `${vue[0]} ${ou} : les réserves, cibles d'au moins 64 px`);
  const p = await page.evaluate(() => { const h = window.__app.hud; return ["mer", "arc", "diamant"].map((k) => h.place[k]?.dansBoite ?? h.reserves.place[k]?.dansBoite); });
  check(p.every((d) => d && d.etoile[0] + d.d / 2 <= d.chiffre[0]) && new Set(p.map((d) => d.d)).size === 1 && new Set(p.map((d) => d.chiffre[2])).size === 1, `${vue[0]} ${ou} : chaque étoile à gauche de son nombre, les étoiles et les nombres à la même taille`);
};

// ---------------------------------------------------------------- 1, 2, 3 : l'accueil, les compteurs, le récif (chaque taille)
const MUSIQUE = args.includes("--musique");
for (const vue of MUSIQUE ? [] : VUES) {
  const { context, page } = await ouvrir(vue, [owned(lagon.slice(0, 6)), etoiles(123, 2, 0), { id: "quota", date: ilYaSemaines(3), cartes: 6 }]);
  await page.waitForTimeout(1500);
  const g = await boites(page, ".galet");
  check(g.length === 4 && !(await page.locator(".galet.albumkey").count()), `${vue[0]} accueil : quatre galets (jouer, choisir, les leçons, le récif), plus celui de l'album`);
  check(g.every((x, i) => x.x >= 134 && x.x + x.w <= 1280 && (!i || x.x >= g[i - 1].x + g[i - 1].w - 4)), `${vue[0]} accueil : les galets répartis, dans l'écran, sans se toucher ni toucher le bouton des parents`);
  await rangee(page, vue, "accueil");
  await shot(page, vue, "01-accueil");
  // le diamant à 0, touché : la phrase nouvelle
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await tap(page, ".reserve.diamant"); await page.waitForTimeout(700);
  const dit = await page.evaluate(() => window.__said.join(" | "));
  check(dit.includes(T.reserves.diamantZero) && dit.includes(T.reserves.diamantGagner), `${vue[0]} le diamant à 0, touché : « ${T.reserves.diamantZero} ${T.reserves.diamantGagner} »`);
  await shot(page, vue, "02-diamant-a-zero", 300);
  // le récif : les compteurs, la petite tête, l'album par le livre
  await tap(page, ".galet.reefkey"); await page.waitForTimeout(300); if (!(await page.evaluate(() => window.__app.reef?.open))) await tap(page, ".galet.reefkey");
  await recifOuvert(page);
  await rangee(page, vue, "récif");
  const pe = await page.evaluate(() => [".hud.stars", ".reserve.arc", ".reserve.diamant"].map((s) => getComputedStyle(document.querySelector(s)).pointerEvents));
  check(pe.every((x) => x === "none"), `${vue[0]} récif : les compteurs ne se touchent pas (une créature reste touchable à travers : ${pe.join(", ")})`);
  const tete = (await boites(page, ".speaker"))[0];
  check(!!tete && tete.x < 200 && tete.y < 200 && tete.w >= 64 && tete.h >= 64 && await page.evaluate(() => document.querySelector(".speaker").classList.contains("tete")), `${vue[0]} récif : « réécouter » est la petite tête de la mascotte, en haut à gauche`);
  const autres = [...(await boites(page, ".boutique-cle")), ...(await boites(page, ".albumkey")), ...(await boites(page, ".homekey"))];
  check(tete && autres.every((b) => tete.y + tete.h <= b.y || tete.x + tete.w <= b.x), `${vue[0]} récif : la tête ne touche aucun bouton du récif`);
  await page.evaluate(() => { window.__said = []; });
  await tap(page, ".speaker"); await page.waitForTimeout(500);
  check((await page.evaluate(() => window.__said[0])) === T.recifBienvenue, `${vue[0]} récif : la tête touchée redit « ${T.recifBienvenue} »`);
  await shot(page, vue, "03-recif");
  await page.evaluate(() => { const a = window.__app.reef.api; a.camX = a.vue.W * 0.78; }); await shot(page, vue, "04-recif-abysses", 1200);
  await tap(page, ".albumkey"); await page.waitForFunction(() => window.__app.album?.open, null, { timeout: 20000 }); await shot(page, vue, "05-album-par-le-recif", 1200);
  // l'accueil en pause : quatre galets aussi
  await page.goto(url + Q + "&choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.waitForTimeout(800); await tap(page, ".galet.play");
  await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
  await page.waitForTimeout(400); await tap(page, ".session-home"); await page.waitForSelector(".keep.play", { timeout: 10000 }); await page.waitForTimeout(600);
  const gp = await boites(page, ".galet.keep");
  check(gp.length === 4 && !(await page.locator(".galet.albumkey").count()), `${vue[0]} accueil en pause : quatre galets (continuer, choisir, les leçons, le récif)`);
  await rangee(page, vue, "accueil en pause");
  await shot(page, vue, "06-accueil-en-pause");
  await context.close();
}

// ---------------------------------------------------------------- 4 : la boutique pendant une séance en pause
const ETAT = () => window.__app && (() => { const a = window.__app, s = a.screen, q = s?.q;
  return { q: q ? JSON.stringify([q.format, q.target, q.answer, q.niveau, q.start, q.jumps]) : null, consigne: a.voice.instruction, questions: a.session.rec.questions, etoilesSeance: a.session.rec.etoiles, etape: a.session.progress.etape, id: a.session.id, enPause: !!a.enPause };
})();
for (const vue of MUSIQUE ? [] : VUES.filter(([n]) => n === "1280" || n === "petit-smartphone")) {
  const { context, page } = await ouvrir(vue, [owned(lagon.slice(0, 4)), etoiles(300, 1, 0), { id: "quota", date: ilYaSemaines(3), cartes: 4 }], Q + "&choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0&questions=4");
  await page.waitForTimeout(800); await tap(page, ".galet.play");
  const attend = () => page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
  await attend(); await page.evaluate(REPONDRE, true); await page.waitForTimeout(800); await attend(); await page.waitForTimeout(500);
  await tap(page, ".session-home"); await page.waitForSelector(".keep.play", { timeout: 10000 }); await page.waitForTimeout(500);
  const avant = await page.evaluate(ETAT), total0 = await page.evaluate(() => window.__app.rewards.total);
  await tap(page, ".keep.reefkey"); await page.waitForTimeout(300); if (!(await page.evaluate(() => window.__app.reef?.open))) await tap(page, ".keep.reefkey");
  await recifOuvert(page);
  check(await page.locator(".boutique-cle").isVisible(), `${vue[0]} pause : dans le récif, le bouton de la boutique (avant ce lot : absent)`);
  // (relecture du lot) la petite tête touchée pendant la pause : la consigne du récif, pas celle de la pause
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await tap(page, ".speaker"); await page.waitForTimeout(500);
  check((await page.evaluate(() => window.__said[0])) === T.recifBienvenue, `${vue[0]} pause : dans le récif, la tête touchée redit « ${T.recifBienvenue} »`);
  await rangee(page, vue, "récif en pause");
  await shot(page, vue, "07-recif-en-pause");
  await tap(page, ".boutique-cle"); await page.waitForSelector(".boutique-tuile", { timeout: 20000 }); await page.waitForTimeout(1500);
  await rangee(page, vue, "boutique en pause");
  const aVendre = await page.evaluate(() => [...window.__app.boutique.vit].find(([, e]) => e === "vendre")?.[0]);
  check(!!aVendre, `${vue[0]} pause : la boutique a une créature à vendre (${aVendre})`);
  await tap(page, `.boutique-tuile[data-id="${aVendre}"]`); await page.waitForTimeout(700);
  await shot(page, vue, "08-boutique-en-pause", 200);
  await tap(page, ".boutique-conf.coche"); await page.waitForTimeout(4500);
  const apres = await page.evaluate(() => ({ total: window.__app.rewards.total, achats: window.__app.rewards.achats.liste.map((x) => x.id ?? x) }));
  check(apres.total < total0 && JSON.stringify(apres.achats).includes(aVendre), `${vue[0]} pause : l'achat est fait (${total0} → ${apres.total} étoiles)`);
  await tap(page, ".boutique-retour").catch(() => {}); await recifOuvert(page); await page.waitForTimeout(3000);
  await shot(page, vue, "09-arrivee-en-pause", 200);
  await tap(page, ".homekey:not(.session-home)"); await page.waitForSelector(".keep.play", { timeout: 15000 }); await page.waitForTimeout(600);
  const retour = await page.evaluate(ETAT);
  const diff = Object.keys(avant).filter((k) => avant[k] !== retour[k]);
  check(!diff.length, `${vue[0]} pause : après la boutique, la séance en pause est intacte (${diff.map((k) => `${k} : ${avant[k]} → ${retour[k]}`).join(" ; ") || "question, consigne, réponses, étoiles de la séance, étape"})`);
  await tap(page, ".keep.play"); await page.waitForTimeout(400); if (await page.evaluate(() => window.__app.enPause)) await tap(page, ".keep.play");
  await page.waitForTimeout(700);
  const repris = await page.evaluate(ETAT);
  check(!repris.enPause && repris.q === avant.q && repris.consigne === avant.consigne, `${vue[0]} pause : « continuer » reprend exactement (même question, même consigne)`);
  const n0 = repris.questions; await attend(); await page.evaluate(REPONDRE, true);
  check(await page.waitForFunction((n0) => window.__app.session.rec.questions > n0, n0, { timeout: 30000 }).then(() => true, () => false), `${vue[0]} pause : la séance continue après la reprise`);
  await context.close();
}

// ---------------------------------------------------------------- 5 : la musique (avec le son)
{
  const vue = VUES[0], QS = "?nosw&voix=rapide&sans=probleme&sansReprise&sans=echauffement&cran=conseille&sansLecon&guides=0&questions=1&module=1&musique=harpe"; // (la séance a une autre musique que l'ambiance : le fondu est essayé)
  const { context, page } = await ouvrir(vue, [], QS, { reel: true });
  await page.waitForSelector(".demarrage", { timeout: 60000 });
  await page.waitForFunction(() => !!window.__app?.sound, null, { timeout: 60000 }).catch(() => {});
  const m0 = await page.evaluate(() => window.__app?.sound?.musiqueJouee ?? null);
  check(m0 === null, "musique : rien avant le toucher de l'écran de démarrage");
  await page.waitForTimeout(1500); await tap(page, ".demarrage");
  const t0 = Date.now();
  check(await page.waitForFunction((k) => window.__app.sound.musiqueJouee === k, SON.musique.horsSeance, { timeout: 8000 }).then(() => true, () => false), `musique : l'ambiance (« ${SON.musique.horsSeance} ») commence au toucher de l'écran de démarrage (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 30000 });
  // le relevé des gains : toutes les 50 ms, chaque musique entendue et son gain propre
  await page.evaluate(() => { const s = window.__app.sound; window.__g = []; const vus = new Set(); setInterval(() => { if (s.joue) vus.add(s.joue); window.__g.push({ t: performance.now(), m: [...vus].filter((m) => m.src).map((m) => [m.key, m.g.gain.value]), ctx: s.ctx.state }); }, 50); });
  // le récif, puis l'accueil : la même musique continue
  await tap(page, ".galet.reefkey"); await page.waitForTimeout(300); if (!(await page.evaluate(() => window.__app.reef?.open))) await tap(page, ".galet.reefkey");
  await recifOuvert(page);
  check((await page.evaluate(() => window.__app.sound.musiqueJouee)) === SON.musique.horsSeance, "musique : dans le récif, l'ambiance continue");
  await tap(page, ".homekey:not(.session-home)"); await page.waitForSelector(".galet.play", { timeout: 15000 }); await page.waitForTimeout(500);
  // « jouer » : la musique de la séance, en fondu enchaîné
  const n0 = await page.evaluate(() => window.__g.length);
  await tap(page, ".galet.play");
  await page.waitForFunction(() => window.__app.session?.rec?.musique, null, { timeout: 30000 });
  const mSeance = await page.evaluate(() => window.__app.session.rec.musique);
  await page.waitForTimeout((SON.musique.fonduEnchaine + 2) * 1000);
  const etatSon = await page.evaluate(() => ({ joue: window.__app.sound.musiqueJouee, voulue: window.__app.sound.voulue, music: window.__app.sound.music?.key, etape: window.__app.session?.progress?.etape, mode: window.__app.modeEcran() }));
  check(etatSon.joue === mSeance, `musique : la séance a la sienne (« ${mSeance} » ; ${JSON.stringify(etatSon)})`);
  const g = await page.evaluate((n0) => window.__g.slice(n0), n0);
  const puiss = g.filter((x) => x.m.length).map((x) => x.m.reduce((a, [, v]) => a + v * v, 0)), deux = g.filter((x) => x.m.length > 1);
  check(Math.min(...puiss) > 0.9, `musique : pas de trou pendant l'enchaînement (puissance la plus basse ${Math.min(...puiss).toFixed(2)}, sur ${puiss.length} relevés)`);
  check(mSeance === SON.musique.horsSeance || (deux.length && deux.every((x) => x.m.filter(([, v]) => v > 0.8).length <= 1)), `musique : jamais deux musiques à leur plein niveau en même temps (${deux.length} relevés pendant le fondu)`);
  // la séance jouée jusqu'au bout : l'ambiance revient
  for (let i = 0; i < 40 && !(await page.evaluate(() => !!document.querySelector(".moon"))); i++) { await page.evaluate(REPONDRE, true).catch(() => {}); if (await page.locator(".cran-ok").isVisible().catch(() => false)) await tap(page, ".cran-ok").catch(() => {}); if (await page.locator(".shelltap").isVisible().catch(() => false)) await tap(page, ".shelltap").catch(() => {}); if (await page.locator(".card").isVisible().catch(() => false)) await tap(page, ".check").catch(() => {}); await page.waitForTimeout(1500); }
  check(await page.waitForFunction((k) => window.__app.sound.musiqueJouee === k, SON.musique.horsSeance, { timeout: 15000 }).then(() => true, () => false), "musique : la séance finie, l'ambiance revient (« à demain »)");
  await shot(page, vue, "10-a-demain-avec-musique");
  // (relecture du lot) « à demain » : les trois galets répartis sur toute l'étendue ; la mascotte redit la consigne de l'accueil
  const g3 = await boites(page, ".galet");
  check(g3.length === 3 && g3[0].x < 200 && g3[2].x + g3[2].w > 1200, `« à demain » : les trois galets répartis (${g3.map((b) => Math.round(b.x + b.w / 2)).join(", ")})`);
  await page.waitForTimeout(1500);
  check((await page.evaluate(() => window.__app.voice.instruction)) === T.accueilConsigneFaite, "« à demain » : la consigne redite est celle de l'accueil (« La séance du jour est finie. Touche une bulle… »)");
  // l'espace parent : tout se tait ; la musique coupée puis rallumée par le parent
  // (l'appui long sur le bouton de l'espace parent, comme le parent)
  { const b = await page.locator(".logo").boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(2400); await page.mouse.up(); }
  await page.waitForSelector(".pa-gate", { timeout: 10000 }); await page.waitForTimeout(600);
  check(await page.evaluate(() => window.__app.sound.held === true && window.__app.sound.ctx.state !== "running"), `musique : rien dans l'espace parent (le son est suspendu : ${await page.evaluate(() => window.__app.sound.ctx.state)})`);
  await shot(page, vue, "11-espace-parent-sans-musique", 200);
  await page.evaluate(() => { window.__app.sound.resume(); window.__app.sound.setPrefs({ musique: false }); }); await page.waitForTimeout(400);
  check((await page.evaluate(() => window.__app.sound.musiqueJouee)) === null, "musique : coupée par le parent");
  await page.evaluate(() => window.__app.sound.setPrefs({ musique: true }));
  check(await page.waitForFunction((k) => window.__app.sound.musiqueJouee === k, SON.musique.horsSeance, { timeout: 8000 }).then(() => true, () => false), "musique : rallumée par le parent, l'ambiance reprend");
  await context.close();
}
{
  // une séance reprise après un rechargement : sa musique, au niveau de la pause, dès le toucher
  const vue = VUES[0], QS = "?nosw&voix=rapide&sans=probleme&sans=echauffement&cran=conseille&sansLecon&guides=0&choix=1:5";
  const { context, page } = await ouvrir(vue, [], QS);
  await page.waitForTimeout(800); await tap(page, ".galet.play");
  await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve, null, { timeout: 60000 });
  const m = await page.evaluate(() => window.__app.session.rec.musique);
  await demarrageReel(page); await page.reload(); await page.waitForSelector(".demarrage", { timeout: 60000 }); await page.waitForTimeout(1500); await tap(page, ".demarrage");
  check(await page.waitForFunction((k) => window.__app.sound.musiqueJouee === k && window.__app.sound.paused, m, { timeout: 8000 }).then(() => true, () => false), `musique : une séance à reprendre commence avec la sienne (« ${m} »), au niveau de la pause`);
  await context.close();
}

check(!errors.length, `aucune erreur dans la page${errors.length ? ` (${errors.slice(0, 3).join(" | ")})` : ""}`);
await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} ÉCHEC(S)`); process.exitCode = 1; }
