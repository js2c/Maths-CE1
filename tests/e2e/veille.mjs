// L'APPLICATION RÉPOND TOUJOURS APRÈS UNE LONGUE INACTIVITÉ (lot « Correctifs de l'installation et de la veille », point 2 ;
// docs/LOTS.md, fiche 12). Sur la tablette, l'application ouverte, après quelques minutes sans toucher : plus de voix, plus de
// musique, un galet touché deux fois n'ouvrait plus rien (les bruits des boutons, en Web Audio, marchaient encore). La piste :
// l'épuisement des lecteurs de médias d'Android (un élément Audio créé pour chaque phrase, jamais libéré ; 17 vidéos de la
// mascotte chargées en même temps). Chromium a la même limite que la tablette, plus haute : ce parcours l'abaisse
// (--max-web-media-player-count, 8 par défaut) et joue, la voix à sa vitesse réelle :
//   1. une séance d'additions de 30 questions : aucun lecteur refusé, aucune phrase muette ;
//   2. de longues inactivités (`--minutes`, 3 par défaut ; la fiche demande 30 : --minutes 30) sur l'accueil, sur une question
//      des additions, de la ligne, des voiliers, de l'étal, et sur l'accueil en pause ; à chaque fois, les lecteurs de médias
//      qui ont une source sont comptés au départ et à la fin (bornés et peu nombreux) ; au retour, la mascotte touchée redit
//      sa phrase (lue depuis son fichier), et sur l'accueil un galet touché deux fois ouvre son écran ;
//   3. la page cachée puis montrée (gelée une minute) ; des lectures refusées (play() rejeté) : notées dans le journal
//      technique, la phrase redite au toucher suivant.
//   node tests/e2e/veille.mjs [--minutes 3] [--limite 8] [--court]
// (RACINE_APP=dossier : la même chose sur une autre copie de app/, par exemple celle de main, pour voir le défaut d'avant)
import { accueilReel, chromium } from "./navigateur.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const MIN = Number(arg("--minutes", 3)), LIMITE = Number(arg("--limite", 8)), COURT = args.includes("--court");
const OUT = resolve("tests/e2e/out/veille"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", `--max-web-media-player-count=${LIMITE}`] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const mesures = [];

const ouvrir = async (q = "", prep = null) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
  await accueilReel(context);
  const page = await context.newPage(), errors = [], bloques = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (/too many WebMediaPlayers/.test(m.text())) bloques.push(m.text()); });
  await page.goto(url + "?nosw&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); await window.__app.store.setSetting("mascotteTouchee", true); });
  if (prep) await page.evaluate(prep.f, prep.a);
  await page.goto(url + "?nosw&son=non&sansReprise&sansLecon&guides=0&cran=conseille&meteo=beau" + q); await page.waitForFunction(() => window.__ready !== undefined);
  // ce que la voix dit (le texte, et s'il a été lu depuis ses fichiers)
  await page.evaluate(() => {
    const v = window.__app.voice, t0 = v.onTalk; window.__dits = [];
    v.onTalk = (t, ms, o) => { window.__dits.push({ t, quand: performance.now(), fichiers: v.files }); return t0?.(t, ms, o); };
  });
  return { context, page, errors, bloques, cdp: await context.newCDPSession(page) };
};
// les lecteurs de médias qui ont une source : les <audio> et <video> de la page, et les Audio de la voix (hors de la page)
const medias = (page) => page.evaluate(() => ({ video: [...document.querySelectorAll("video")].filter((v) => v.getAttribute("src")).length, voix: window.__app.voice.lecteursActifs?.() ?? null, voixCrees: (window.__app.voice.constructor.name, null) }));
const etat = (page) => page.evaluate(() => ({ manquees: [...window.__app.voice.misses], refus: window.__app.voice.refus ?? null, fichiers: window.__app.voice.files }));
// la mascotte touchée : sa phrase est-elle redite, et lue depuis son fichier ?
const toucherMascotte = async (page) => {
  const avant = await page.evaluate(() => ({ n: window.__dits.length, f: window.__app.voice.files, m: window.__app.voice.misses.size }));
  await page.tap(".mascotte-tap", { force: true });
  const dit = await page.waitForFunction((n) => window.__dits.length > n, avant.n, { timeout: 6000 }).then(() => true, () => false);
  await page.waitForTimeout(1500);
  const apres = await page.evaluate(() => ({ f: window.__app.voice.files, m: window.__app.voice.misses.size, texte: window.__dits.at(-1)?.t }));
  return { dit, lue: apres.f > avant.f && apres.m === avant.m, texte: apres.texte };
};
// sur l'accueil : un galet touché deux fois ouvre-t-il son écran ? (« choisir » : les tuiles des exercices)
const galet = async (page, cle = "choisir") => {
  for (let i = 0; i < 2; i++) { await page.tap(`.galet.${cle}`, { force: true }); await page.waitForTimeout(400); }
  const ouvert = await page.waitForSelector(".choix-ex", { timeout: 10000 }).then(() => true, () => false);
  return ouvert;
};
// une longue inactivité : rien n'est touché pendant `min` minutes ; les lecteurs comptés toutes les 30 s
const inactivite = async (page, nom, min = MIN) => {
  const debut = await medias(page), serie = [debut];
  for (let s = 0; s < min * 60; s += 30) { await page.waitForTimeout(30000); serie.push(await medias(page)); }
  const max = Math.max(...serie.map((m) => m.video + (m.voix ?? 0)));
  mesures.push({ ecran: nom, minutes: min, debut, fin: serie.at(-1), max });
  return { debut, fin: serie.at(-1), max };
};
const attendreQuestion = (page, quoi) => page.waitForFunction(quoi, null, { timeout: 120000, polling: 200 }).then(() => true, () => false);
const fin = async (o, nom) => {
  const e = await etat(o.page);
  check(!o.bloques.length, `${nom} : aucun lecteur de médias refusé par le navigateur (limite ${LIMITE})${o.bloques.length ? ` — ${o.bloques.length} refus` : ""}`);
  check(!e.manquees.length, `${nom} : aucune phrase muette (${e.fichiers} fichiers lus${e.manquees.length ? ` ; sans voix : ${e.manquees.slice(0, 3).join(" | ")}` : ""})`);
  check(!o.errors.length, `${nom} : aucune erreur (${o.errors.slice(0, 2).join(" | ")})`);
  await o.context.close();
};

// 1. une séance d'additions de 30 questions, la voix à sa vitesse réelle
{
  const o = await ouvrir("&module=2"), { page } = o;
  for (let i = 0; i < 2; i++) { await page.tap(".galet.play", { force: true }); await page.waitForTimeout(400); }
  let n = 0, maxM = 0;
  for (; n < (COURT ? 12 : 30); n++) {
    if (!(await attendreQuestion(page, () => window.__app.facts?.q && window.__app.facts.resolve && !window.__app.facts.locked))) break;
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const q = window.__app.facts.q; return q.a + q.b; });
    for (const d of String(r)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(150); }
    await page.tap('.key[data-key="valider"]', { force: true });
    await page.waitForFunction(() => !window.__app.facts?.resolve || window.__app.facts.locked, null, { timeout: 30000 }).catch(() => {});
    const m = await medias(page); maxM = Math.max(maxM, m.video + (m.voix ?? 0));
  }
  check(n >= (COURT ? 12 : 30), `séance : ${n} questions répondues, la voix à vitesse réelle`);
  check(maxM <= 6, `séance : au plus ${maxM} lecteurs de médias avec une source à la fois (2 vidéos de la mascotte, 2 à 4 sons de la voix)`);
  // 2. une longue inactivité sur une question des additions
  const r = await inactivite(page, "question des additions");
  check(r.max <= 6 && r.fin.video + (r.fin.voix ?? 0) <= r.debut.video + (r.debut.voix ?? 0) + 2, `question des additions, ${MIN} min sans toucher : lecteurs avec une source ${r.debut.video + (r.debut.voix ?? 0)} au départ, ${r.fin.video + (r.fin.voix ?? 0)} à la fin, ${r.max} au plus`);
  const t = await toucherMascotte(page);
  check(t.dit && t.lue, `question des additions, au retour : la mascotte touchée redit « ${t.texte} », lue depuis son fichier`);
  // la pause : l'accueil en pause, une longue inactivité, puis un galet touché deux fois
  await page.tap(".homekey", { force: true }); await page.waitForFunction(() => window.__app.enPause, null, { timeout: 15000 }); await page.waitForTimeout(800);
  const p = await inactivite(page, "accueil en pause");
  const tp = await toucherMascotte(page);
  check(tp.dit && tp.lue && p.max <= 6, `accueil en pause, ${MIN} min sans toucher : ${p.max} lecteurs au plus ; la mascotte touchée redit « ${tp.texte} »`);
  check(await galet(page, "choisir"), "accueil en pause, au retour : le galet « choisir » touché deux fois ouvre son écran");
  await page.screenshot({ path: join(OUT, "pause-choisir.png") });
  await fin(o, "séance, inactivités sur la question et en pause");
}

// 3. l'accueil : longue inactivité, page cachée puis montrée, lectures refusées
{
  const o = await ouvrir(), { page, cdp } = o;
  const r = await inactivite(page, "accueil");
  const t = await toucherMascotte(page);
  check(r.max <= 6 && t.dit && t.lue, `accueil, ${MIN} min sans toucher : ${r.max} lecteurs au plus ; la mascotte touchée redit « ${t.texte} »`);
  // la page cachée (l'écran en veille, une autre application) une minute, gelée, puis montrée
  for (let k = 0; k < (COURT ? 1 : 3); k++) {
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); });
    await cdp.send("Page.setWebLifecycleState", { state: "frozen" });
    await page.waitForTimeout(COURT ? 15000 : 60000);
    await cdp.send("Page.setWebLifecycleState", { state: "active" });
    await page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event("visibilitychange")); });
    await page.waitForTimeout(800);
    const tt = await toucherMascotte(page);
    check(tt.dit && tt.lue, `page cachée puis montrée (${k + 1}) : la mascotte touchée redit « ${tt.texte} », lue depuis son fichier`);
  }
  const notes = await page.evaluate(() => window.__journalTechnique.filter((e) => e.type === "page").map((e) => e.message));
  check(notes.includes("en arrière-plan") && notes.includes("au premier plan"), `journal technique : les passages en arrière-plan et au premier plan (${[...new Set(notes)].join(", ")})`);
  // des lectures refusées : play() rejeté pendant 10 s (lecteurs épuisés) ; noté, puis la phrase redite au toucher suivant
  await page.evaluate(() => { const p = HTMLMediaElement.prototype.play; window.__playOrig = p; HTMLMediaElement.prototype.play = function () { if (this.tagName === "AUDIO") return Promise.reject(new DOMException("lecteurs épuisés (essai)", "NotAllowedError")); return p.call(this); }; });
  const avant = await page.evaluate(() => window.__dits.length);
  await page.tap(".mascotte-tap", { force: true }); await page.waitForTimeout(6000);
  const refus = await page.evaluate(() => ({ refus: window.__app.voice.refus, note: window.__journalTechnique.some((e) => e.message === "lecture refusée"), aRedire: window.__app.voice.aRedire?.text ?? null }));
  check(refus.refus > 0 && refus.note && !!refus.aRedire, `lecture refusée : notée dans le journal technique, la phrase gardée pour être redite (« ${refus.aRedire} »)`);
  await page.evaluate(() => { HTMLMediaElement.prototype.play = window.__playOrig; });
  await page.waitForFunction(() => !window.__app.voice.speaking, null, { timeout: 20000 }).catch(() => {});
  const f0 = await page.evaluate(() => window.__app.voice.files);
  await page.tap(".logo", { force: true, timeout: 3000 }).catch(() => page.mouse.click(640, 120));
  const redite = await page.waitForFunction((f0) => window.__app.voice.files > f0, f0, { timeout: 8000 }).then(() => true, () => false);
  check(redite && (await page.evaluate((n) => window.__dits.slice(n).length, avant)) >= 2, "lecture refusée : au toucher suivant, la phrase est redite, lue depuis son fichier");
  check(await galet(page, "choisir"), "accueil, au retour : le galet « choisir » touché deux fois ouvre son écran");
  await fin(o, "accueil, veille, lectures refusées");
}

// 4. une longue inactivité sur une question de chaque autre exercice (ligne, voiliers, étal)
if (!COURT) for (const [nom, q, prete] of [
  ["ligne graduée", "&choix=1:3", () => !!window.__app.screen?.q || !!document.querySelector(".answer, .key")],
  ["voiliers", "&choix=4:2", () => !!window.__app.voiliers?.actif && !!window.__app.voiliers?.attend],
  ["étal", "&choix=6:2", () => !!window.__app.etal?.attend],
]) {
  const o = await ouvrir(q, { f: async () => { const n = Date.now(); for (const m of [{ module: 4, niveau: 2, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [1, 2, 3] }, { module: 6, niveau: 2, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L15", "L16"], exemples: [1, 2, 3] }]) await window.__app.store.put("niveaux", m); void n; } }), { page } = o;
  for (let i = 0; i < 2; i++) { await page.tap(".galet.play", { force: true }); await page.waitForTimeout(400); }
  const ok = await attendreQuestion(page, prete);
  await page.waitForTimeout(3000);
  const r = await inactivite(page, nom);
  const t = await toucherMascotte(page);
  check(ok && r.max <= 6 && t.dit && t.lue, `${nom}, ${MIN} min sans toucher sur une question : ${r.debut.video + (r.debut.voix ?? 0)} lecteurs au départ, ${r.fin.video + (r.fin.voix ?? 0)} à la fin, ${r.max} au plus ; la mascotte touchée redit « ${t.texte} »`);
  await page.screenshot({ path: join(OUT, `${nom.replace(/\W+/g, "-")}.png`) });
  await fin(o, nom);
}

writeFileSync(join(OUT, "mesures.json"), JSON.stringify({ limite: LIMITE, minutes: MIN, mesures }, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nveille : l'application répond toujours, les lecteurs de médias restent peu nombreux");
process.exitCode = fail.length ? 1 : 0;
