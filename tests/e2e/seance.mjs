// PARCOURS D'UNE SÉANCE COMPLÈTE dans Chromium (tablette 1280 × 800, tactile), voix accélérée :
// premier lancement -> accueil (la mascotte salue, sans nom) -> échauffement -> leçon L1 (niveau 1, la
// première fois) et son exercice guidé -> questions (justes et fausses) -> récompense -> « à demain ». Puis vérifie la base (séance terminée, réponses, étoiles, aucun nom)
// et qu'une relance le même jour affiche la lune au lieu de « jouer ». Captures dans tests/e2e/out/seance.
//   node tests/e2e/seance.mjs [--out dossier] [--questions 3]
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/seance")), N = Number(opt("--questions", 3));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const q = `?nosw&voix=rapide&questions=${N}&guides=2&faits=5`;

await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined);
await shot("1-accueil");
await page.tap(".play", { force: true });
// (lot « Mascotte » : plus de choix du nom ; la mascotte salue et souhaite la bienvenue)
await page.waitForFunction(() => /bienvenue/i.test(window.__app.bulle.etat().texte), null, { timeout: 20000 }); await page.waitForTimeout(300);
check(!(await page.locator(".name").count()), "premier lancement : pas de choix du nom, la bienvenue");
await shot("2-bienvenue");

// l'échauffement : répond au pavé (juste, sauf le premier fait) ; l'aide du coquillage au premier fait
let f = 0, sawHelp = false, facts = 0;
const typeIn = async (n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
for (const until = Date.now() + 120000; Date.now() < until;) {
  const st = await page.evaluate(() => { const s = window.__app.facts; return { done: !!window.__app.runner || !!document.querySelector(".tally"), q: s?.q && !s.locked && s.resolve ? { a: s.q.a, b: s.q.b, base: !!s.q.base, fam: s.q.famille } : null }; });
  if (st.done) break;
  if (!st.q) { await page.waitForTimeout(120); continue; }
  if (f === 0) { await page.waitForTimeout(300); await shot("3a-echauffement"); }
  if (!st.q.base && !sawHelp) { sawHelp = true; await page.tap(".help", { force: true }); await page.waitForTimeout(2600); await shot("3b-aide-coquillage"); await page.waitForFunction(() => !window.__app.facts.locked, null, { timeout: 30000 }); }
  const wrong = !st.q.base && facts === 0;
  if (!st.q.base) facts++;
  await typeIn(wrong ? 9 + st.q.a + st.q.b : st.q.a + st.q.b);
  if (wrong) { await page.waitForTimeout(700); await shot("3c-echauffement-faux"); }
  f++;
  await page.waitForFunction(() => !window.__app.facts.resolve || window.__app.facts.locked, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(200);
}
check(sawHelp, "l'aide du coquillage a été montrée");

// répond à chaque question dès qu'elle accepte une réponse : juste, sauf la 2e (fausse)
let k = 0, sawLesson = false;
const deadline = Date.now() + 240000;
while (Date.now() < deadline) {
  const st = await page.evaluate(() => { const s = window.__app.screen; return { moon: !!document.querySelector(".moon") || !!document.querySelector(".tally"), q: s?.q && !s.locked && s.resolve ? { guide: !!s.q.guide, format: s.q.format, answer: s.q.answer, wrong: s.q.choices?.find((c) => c.value !== s.q.answer)?.value ?? null } : null, lesson: !!window.__app.lessons.abort }; });
  if (st.moon) break;
  if (st.lesson && !sawLesson) { sawLesson = true; await page.waitForTimeout(3000); await shot("3-lecon-L1"); }
  if (st.lesson) { await page.waitForTimeout(150); continue; }
  if (!st.q) { await page.waitForTimeout(150); continue; }
  const right = st.q.guide || k !== 1 || st.q.wrong === null;
  if (st.q.guide) await shot("3b-exercice-guide");
  if (!st.q.guide && k === 0) await shot("4-question");
  await page.tap(`.answer[data-value="${right ? st.q.answer : st.q.wrong}"]`, { force: true });
  if (!st.q.guide) k++;
  if (!right) { await page.waitForTimeout(1500); await shot("5-retour-faux"); }
  await page.waitForFunction(() => !window.__app.screen?.resolve || window.__app.screen.locked, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(300);
}
await page.waitForSelector(".tally", { timeout: 60000 });
await page.waitForTimeout(900); await shot("6-recompense");
await page.waitForSelector(".moon", { timeout: 60000 }); await page.waitForTimeout(800);
await shot("7-a-demain");
check(sawLesson, "la leçon L1 a été jouée");
const db = await page.evaluate(async () => { const s = window.__app.store; return { faits: await s.all("faits"), base: await s.setting("tempsDeBase"), seances: await s.all("seances"), reponses: (await s.all("reponses")).filter((r) => r.module === 1), rep2: (await s.all("reponses")).filter((r) => r.module === 2), etoiles: await s.get("recompenses", "etoiles"), nom: await s.setting("mascotte"), niveau: await s.get("niveaux", 1) }; });
const se = db.seances.at(-1);
check(db.base?.mesures?.length === 3, `temps de base mesuré (${db.base?.mesures?.map((m) => Math.round(m)).join(", ")} ms)`);
check(db.faits.length >= 3 && db.faits.filter((x) => x.boite === 1).length >= 1, `au moins 3 nouveaux faits rangés en boîtes (lot 2 : voie rapide, faits ajoutés) (${db.faits.map((x) => `${x.fait}:${x.boite}`).join(" ")})`);
check(db.rep2.some((r) => r.aide) && db.rep2.some((r) => r.revient), "échauffement : réponse avec aide, fait raté revenu");
check(db.rep2.length >= 3 + 5, `${db.rep2.length} réponses d'échauffement enregistrées`);
check(db.nom == null, `aucun nom de mascotte enregistré (${db.nom})`);
check(se?.terminee === true, "séance terminée enregistrée");
check(db.reponses.filter((r) => r.guide).length === 1 && db.reponses[0].guide && db.reponses[0].forme === "lire", `un exercice guidé « lire » après la leçon (${db.reponses.filter((r) => r.guide).length})`);
check(se?.lecons?.[0]?.id === "L1" && se.lecons[0].vue && se.lecons[0].raison === "niveau", `leçon L1 notée dans la séance (${JSON.stringify(se?.lecons)})`);
check(db.niveau?.lecons?.includes("L1"), "L1 vue : elle ne sera pas rejouée à la prochaine séance");
check(db.reponses.filter((r) => !r.guide).length >= N, `${db.reponses.filter((r) => !r.guide).length} questions enregistrées (au moins ${N})`);
check(db.reponses.every((r) => r.seance === se.id), "chaque réponse porte le numéro de la séance");
check(db.etoiles?.total === se.etoiles - (se.cartes?.length ?? 0) * 25 && se.etoiles >= 13, `étoiles : ${se.etoiles} gagnées, ${se.cartes?.length ?? 0} coquillage(s) ouvert(s), trésor ${db.etoiles?.total}`);
check((se.cartes?.length ?? 0) >= 1, `une séance complète rapporte au moins un coquillage (${se.cartes?.length ?? 0})`);
check(db.reponses.filter((r) => !r.guide).at(-1)?.juste === true, "la séance finit sur une réussite");
const hudShown = await page.evaluate(() => window.__app.hud.shown); check(hudShown === db.etoiles.total, `le compteur affiche le trésor (${hudShown})`);
console.log(JSON.stringify({ seance: { ...se, etapes: se.etapes.map((e) => `${e.id}${e.sautee ? ` (sautée : ${e.sautee})` : ` ${e.dureeS} s`}`) } }, null, 1));
// le son (lot 2, étape 4) : contexte à 48 kHz, bruitages joués et décodés, musique de la séance tirée et enregistrée, arrêtée à la fin
const son = await page.evaluate(() => { const s = window.__app.sound; return { rate: s.ctx?.sampleRate, played: [...new Set(s.played)], decoded: Object.values(s.buffers).filter(Boolean).length, music: s.musicKey }; });
check(son.rate === 48000 && son.decoded === 8, `son : contexte à ${son.rate} Hz, ${son.decoded} bruitages décodés`);
check(["bonne", "erreur", "etoile", "bouton", "coquillage", "carte"].every((k) => son.played.includes(k)), `bruitages joués : ${son.played.join(", ")}`);
check(["harpe", "marimba", "profondeurs"].includes(se.musique) && son.music === null, `musique de la séance « ${se.musique} », arrêtée après la séance`);
const voix = await page.evaluate(() => ({ manques: [...window.__app.voice.misses], index: !!window.__app.voice.index }));
check(voix.index && voix.manques.length === 0, `chaque phrase dite a son fichier son${voix.manques.length ? ` ; sans fichier : ${voix.manques.join(" | ")}` : ""}`);
// relance le même jour : la lune, pas de « jouer »
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(800);
check((await page.locator(".play:not(.again)").count()) === 0 && (await page.locator(".moon").count()) === 1 && (await page.locator(".again").count()) === 1, "relance le même jour : la lune (décor) et « Encore ! » au lieu de « jouer »");
await shot("8-relance-meme-jour");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
