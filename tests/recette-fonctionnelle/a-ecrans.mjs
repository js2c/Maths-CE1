// RECETTE FONCTIONNELLE DU LOT 3, PARTIE A : les écrans et leurs états (docs/PROMPT-RECETTE-LOT3.md, session 1).
// Captures au format de la tablette, en base neuve et en « un mois » quand l'écran diffère, rangées en planches de 4
// légendées (écran, état, voix, tout ce qui est touchable). L'application n'est pas modifiée : elle est pilotée par ses
// paramètres de test (main.js : ?choix, ?cran, ?sans, ?lecon, ?etoiles…) et par window.__app.
//   node tests/recette-fonctionnelle/a-ecrans.mjs [--seulement theme[,theme]] (themes : voir THEMES en bas)
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { OUT, Serie, attendre, ecrireIndex, indexPartie, navigateur, opt, ouvrir, silence, toucher } from "./commun.mjs";
import { recifOuvert, toucherCreature } from "../e2e/recif-commun.mjs";

const DIR = join(OUT, "A-ecrans");
const nav = await navigateur();
const index = [], incidents = [];
const lecons = JSON.parse(readFileSync(new URL("../../app/content/lecons.json", import.meta.url)));
async function fin(serie, s, desc) {
  const pl = await serie.planches(nav);
  for (const p of pl) index.push([p.file, `${desc} : ${p.contenu}`]);
  if (s?.errors?.length) incidents.push(`${serie.prefix} : ${[...new Set(s.errors)].join(" | ")}`);
}
const pause = (p, ms) => p.waitForTimeout(ms);
// attendre une question posée (ligne : screen ; additions et calcul : facts) ; renvoie son type
const question = (page, ms = 40000) => attendre(page, () => { const A = window.__app; return [A.screen, A.facts].some((s) => s && s.q && s.resolve && !s.locked); }, null, ms);
// répondre juste à la question en cours (ligne : la bulle ou la bande ; additions, calcul : le pavé)
async function juste(page) {
  const st = await page.evaluate(() => { const A = window.__app, l = A.screen, f = A.facts; if (l?.q && l.resolve && !l.locked) return { l: true, f: l.q.format, a: l.q.answer }; if (f?.q && f.resolve && !f.locked) { const q = f.q; return { l: false, a: q.format === "ecrire" ? q.answer : q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n ?? q.a + q.b }; } return null; });
  if (!st) return false;
  if (st.l) { if (st.f === "lire" || st.f === "sauter") await toucher(page, `.answer[data-value="${st.a}"]`); else if (st.f === "ecrire") await taper(page, st.a); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); }
  else await taper(page, st.a);
  return true;
}
async function taper(page, n) { for (const d of String(n)) { await toucher(page, `.key[data-key="${d}"]`); await pause(page, 170); } await toucher(page, '.key[data-key="valider"]'); }
// une séance ouverte sur la notion du jour, sans échauffement (le nom et le cran donnés)
const notion = (base, choix, cran = "conseille", extra = "") => ouvrir(nav, { base, nom: true, params: `choix=${choix}&cran=${cran}&sans=echauffement,defi${extra ? `&${extra}` : ""}` });

// ---------------------------------------------------------------- 1. l'accueil
async function accueil() {
  const S = new Serie(DIR, "A01-accueil", "Partie A · l'accueil (avant, après la séance du jour, en pause)");
  let s = await ouvrir(nav, { base: "neuve" });
  await S.shot(s.page, { ecran: "accueil", etat: "base neuve, premier lancement, avant la séance" });
  // (lot « Mascotte » : plus de choix du nom ; la mascotte salue et souhaite la bienvenue, dans sa bulle)
  await toucher(s.page, ".play"); await attendre(s.page, () => /bienvenue/i.test(window.__app.bulle.etat().texte) && window.__app.bulle.etat().visible); await pause(s.page, 1200);
  await S.shot(s.page, { ecran: "la mascotte souhaite la bienvenue", etat: "base neuve, après « jouer »" });
  await s.context.close();
  s = await ouvrir(nav, { base: "mois" });
  await S.shot(s.page, { ecran: "accueil", etat: "un mois, avant la séance du jour" });
  await toucher(s.page, ".play"); await attendre(s.page, () => document.querySelector(".cran")); await pause(s.page, 800);
  await S.shot(s.page, { ecran: "sélecteur de difficulté", etat: "un mois, juste après « jouer »" });
  await toucher(s.page, '.cran[aria-label="conseille"]'); await pause(s.page, 600); await S.shot(s.page, { ecran: "sélecteur de difficulté", etat: "un cran touché (conseillé)" });
  await toucher(s.page, ".cran-ok"); await question(s.page); await pause(s.page, 800);
  await S.shot(s.page, { ecran: "échauffement", etat: "un mois, première question" });
  await toucher(s.page, ".session-home"); await pause(s.page, 1200);
  await S.shot(s.page, { ecran: "accueil en pause", etat: "un mois, la maison touchée pendant l'échauffement" });
  await s.context.close();
  // après la séance du jour : une séance terminée aujourd'hui
  for (const base of ["neuve", "mois"]) {
    s = await ouvrir(nav, { base, nom: true, avant: (p) => p.evaluate(() => window.__app.store.add("seances", { debut: Date.now() - 900000, fin: Date.now() - 200000, dureeS: 700, terminee: true, module: 1, questions: 30, justes: 25, reussite: 0.83, etoiles: 30, etapes: [] })) });
    await pause(s.page, 800); await S.shot(s.page, { ecran: "accueil", etat: `${base === "neuve" ? "base neuve" : "un mois"}, après la séance du jour (lune, « Encore ! »)` });
    if (base === "neuve") { await toucher(s.page, ".again"); await pause(s.page, 1500); await S.shot(s.page, { ecran: "entraînement libre (« Encore ! »)", etat: "après la séance du jour" }); }
    await s.context.close();
  }
  await fin(S, s, "L'accueil");
}

// ---------------------------------------------------------------- 2. l'écran « choisir »
async function choisir() {
  const S = new Serie(DIR, "A02-choisir", "Partie A · l'écran « choisir » (exercices, niveaux, conseillé, validés)");
  for (const base of ["neuve", "mois"]) {
    for (const ex of ["ligne", "additions", "calcul"]) { // (lot « Les leçons » : les leçons ont leur bulle à l'accueil)
      const s = await ouvrir(nav, { base, nom: true });
      await toucher(s.page, ".choisir"); await attendre(s.page, () => document.querySelector(".choix-ex")); await pause(s.page, 900);
      if (ex === "ligne") await S.shot(s.page, { ecran: "choisir : les exercices", etat: base === "neuve" ? "base neuve" : "un mois" });
      await toucher(s.page, `.choix-ex[aria-label="${ex}"]`); await pause(s.page, 450); await toucher(s.page, `.choix-ex[aria-label="${ex}"]`); await attendre(s.page, () => document.querySelector(".choix-tuile")); await pause(s.page, 1200);
      await S.shot(s.page, { ecran: `choisir : ${ex === "lecons" ? "les leçons" : ex === "ligne" ? "niveaux de la ligne graduée" : ex === "additions" ? "familles d'additions" : "niveaux du calcul rapide"}`, etat: base === "neuve" ? "base neuve" : "un mois" });
      await s.context.close();
    }
  }
  await fin(S, null, "L'écran « choisir »");
}

// ---------------------------------------------------------------- 3. sélecteur, échauffement, une question de chaque exercice
async function questions() {
  const S = new Serie(DIR, "A03-questions", "Partie A · sélecteur, échauffement, une question de chaque exercice");
  let s = await ouvrir(nav, { base: "neuve", nom: true, params: "choix=1:3" });
  await toucher(s.page, ".play"); await attendre(s.page, () => document.querySelector(".cran")); await pause(s.page, 800);
  await S.shot(s.page, { ecran: "sélecteur de difficulté", etat: "base neuve (4 crans, rien de touché)" });
  await toucher(s.page, '.cran[aria-label="conseille"]'); await toucher(s.page, ".cran-ok");
  await attendre(s.page, () => document.querySelector(".skip-warmup")); await pause(s.page, 500);
  await S.shot(s.page, { ecran: "échauffement", etat: "base neuve, la consigne d'entrée (« passer l'échauffement » visible)" });
  await question(s.page); await pause(s.page, 700);
  await S.shot(s.page, { ecran: "échauffement", etat: "base neuve, première question (temps de base)" });
  await s.context.close();
  // la ligne graduée : chaque format (niveau 1 sauter, 3 lire, 5 placer, 8 estimer, 12 écrire), puis additions et calcul
  const cas = [["1:1", "ligne graduée niveau 1 (sauter / lire)"], ["1:4", "ligne graduée niveau 4"], ["1:5", "ligne graduée niveau 5 (lire / placer)"], ["1:8", "ligne graduée niveau 8 (estimer)"], ["1:9", "ligne graduée niveau 9 (centaines)"], ["1:12", "ligne graduée niveau 12 (dictée)"], ["2:3", "additions famille 3"], ["3:2", "calcul rapide niveau 2 (mur)"], ["3:7", "calcul rapide niveau 7 (chemin)"]];
  for (const [ch, nom] of cas) {
    s = await notion("mois", ch, "conseille", "sansLecon&guides=0");
    await toucher(s.page, ".play");
    for (let k = 0; k < 2; k++) { if (!(await question(s.page))) break; await pause(s.page, 900); await S.shot(s.page, { ecran: nom, etat: `un mois, cran conseillé, question ${k + 1}` }); await juste(s.page); await pause(s.page, 300); }
    await s.context.close();
  }
  await fin(S, s, "Sélecteur, échauffement, questions");
}

// ---------------------------------------------------------------- 4. les aides (coquillage)
async function aides() {
  const S = new Serie(DIR, "A04-aides", "Partie A · les aides du coquillage (chaque famille, chaque support)");
  const cas = [...[1, 2, 3, 4, 5, 6, 7].map((f) => [`2:${f}`, `additions famille ${f}`]), ["3:1", "calcul niveau 1 (chemin)"], ["3:2", "calcul niveau 2 (mur)"], ["3:6", "calcul niveau 6 (mur, + 9)"], ["3:7", "calcul niveau 7 (chemin, passer la dizaine)"]];
  for (const [ch, nom] of cas) {
    const s = await notion("mois", ch, "conseille", "sansLecon&guides=0");
    await toucher(s.page, ".play");
    // une question avec le coquillage visible
    let ok = false;
    for (let k = 0; k < 16 && !ok; k++) { if (!(await question(s.page))) break; await pause(s.page, 500); ok = await s.page.evaluate(() => { const h = document.querySelector(".help"); return !!h && getComputedStyle(h).visibility !== "hidden"; }); if (!ok) await juste(s.page); }
    if (!ok) { await S.shot(s.page, { ecran: nom, etat: "pas de coquillage visible sur 16 questions", note: "aide non capturée" }); await s.context.close(); continue; }
    await S.shot(s.page, { ecran: nom, etat: "question, coquillage visible" });
    await toucher(s.page, ".help"); await pause(s.page, 1800);
    await S.shot(s.page, { ecran: nom, etat: "aide du coquillage en cours" });
    await silence(s.page, 12000); await pause(s.page, 600);
    if (ch.startsWith("2:1") || ch.startsWith("3:2") || ch.startsWith("3:7")) await S.shot(s.page, { ecran: nom, etat: "après l'aide" });
    await s.context.close();
  }
  await fin(S, null, "Les aides");
}

// ---------------------------------------------------------------- 5. les corrections (E1 à E7, C1 à C5, additions) et « je ne sais pas »
// une mauvaise réponse qui donne le code voulu, sur la question en cours (null si impossible ici)
const trouve = (page, code) => page.evaluate(async (code) => {
  const A = window.__app, G = await import("./js/modules/numberline/generator.js"), C = await import("./js/modules/calc/calc.js");
  const l = A.screen, f = A.facts;
  if (l?.q && l.resolve && !l.locked) {
    const q = l.q, cand = new Set([...(q.choices ?? []).map((c) => c.value)]);
    if (!q.choices) { for (let v = q.min; v <= q.max; v += q.format === "estimer" ? 1 : q.step) cand.add(v); for (const v of [...G.e6Values(q.answer), G.e7Value(q.answer)]) if (v != null) cand.add(v); }
    for (const v of cand) if (G.classify(q, v) === code) return { l: true, f: q.format, v };
    return null;
  }
  // (la dictée du niveau 12 se tape au pavé de l'écran des additions : app.facts, avec la question de la ligne)
  if (f?.q && f.resolve && !f.locked && f.q.format === "ecrire") { const q = f.q; for (const v of [...G.e6Values(q.answer), G.e7Value(q.answer), q.answer + 1]) if (v != null && G.classify(q, v) === code) return { l: false, v }; return null; }
  if (f?.q && f.resolve && !f.locked && f.q.module === 3) { const q = f.q; for (let v = 0; v <= 120; v++) if (C.classifyCalc({ ...q, forme: q.forme === "trouDroite" ? "trou" : "directe" }, v) === code) return { l: false, v }; }
  return null;
}, code);
async function mauvaise(page, t) {
  if (!t.l) return taper(page, t.v);
  if (t.f === "lire" || t.f === "sauter") return toucher(page, `.answer[data-value="${t.v}"]`);
  if (t.f === "ecrire") return taper(page, t.v);
  return page.evaluate((v) => { const s = window.__app.screen; s.aimed = v; s.answer(v, null); }, t.v);
}
async function corrections() {
  const S = new Serie(DIR, "A05-corrections", "Partie A · les corrections (E1 à E7, C1 à C5, additions) et « je ne sais pas »");
  const cas = [["E1", "1:2"], ["E2", "1:5"], ["E3", "1:4"], ["E4", "1:6"], ["E5", "1:3"], ["E6", "1:9"], ["E7", "1:12"], ["C1", "3:2"], ["C3", "3:6"], ["C4", "3:7"], ["C5", "3:9"]];
  for (const [code, ch] of cas) {
    const s = await notion("mois", ch, "conseille", "sansLecon&guides=0");
    await toucher(s.page, ".play");
    let t = null;
    for (let k = 0; k < 12 && !t; k++) { if (!(await question(s.page))) break; await pause(s.page, 400); t = await trouve(s.page, code); if (!t) { await juste(s.page); await pause(s.page, 300); } }
    if (!t) { await S.shot(s.page, { ecran: `correction ${code} (${ch})`, etat: "aucune question de ce niveau ne permet cette erreur en 12 questions", note: "non capturée" }); await s.context.close(); continue; }
    await S.shot(s.page, { ecran: `correction ${code} · exercice ${ch} (module:niveau)`, etat: `question, l'enfant va répondre ${t.v}` });
    await mauvaise(s.page, t); await pause(s.page, 1300);
    await S.shot(s.page, { ecran: `correction ${code}`, etat: `réponse ${t.v} : début de la correction` });
    await pause(s.page, 2500); await S.shot(s.page, { ecran: `correction ${code}`, etat: "correction, 2,5 s plus tard" });
    await s.context.close();
  }
  // C2 : juste mais lent (au-delà du temps de base + 8 s)
  let s = await notion("mois", "3:3", "conseille", "sansLecon&guides=0");
  await toucher(s.page, ".play");
  if (await question(s.page)) {
    const lent = await s.page.evaluate(() => window.__app.facts.q.lentMs ?? 11000); await pause(s.page, lent + 800);
    await S.shot(s.page, { ecran: "correction C2 (juste mais lent)", etat: `question restée ${Math.round(lent / 100) / 10} s sans réponse` });
    await juste(s.page); await pause(s.page, 1300); await S.shot(s.page, { ecran: "correction C2", etat: "réponse juste mais lente : le raccourci" });
    await pause(s.page, 2500); await S.shot(s.page, { ecran: "correction C2", etat: "2,5 s plus tard" });
  }
  await s.context.close();
  // additions : une erreur directe et une à trou
  for (const [cran, nom] of [["conseille", "addition directe"], ["tresdur", "addition à trou"]]) {
    s = await notion("mois", "2:2", cran, "sansLecon&guides=0");
    await toucher(s.page, ".play");
    for (let k = 0; k < 8; k++) {
      if (!(await question(s.page))) break; await pause(s.page, 400);
      const q = await s.page.evaluate(() => { const q = window.__app.facts.q; return { forme: q.forme ?? "directe", a: q.a, b: q.b }; });
      if ((cran === "conseille") !== (q.forme === "directe")) { await juste(s.page); continue; }
      await S.shot(s.page, { ecran: `correction : ${nom}`, etat: `question ${q.forme}` });
      const v = q.forme === "trouDroite" ? q.b + 1 : q.forme === "trouGauche" ? q.a + 1 : q.a + q.b + 1;
      await taper(s.page, v); await pause(s.page, 1300); await S.shot(s.page, { ecran: `correction : ${nom}`, etat: `réponse ${v} : début de la correction` });
      await pause(s.page, 2500); await S.shot(s.page, { ecran: `correction : ${nom}`, etat: "2,5 s plus tard" });
      break;
    }
    await s.context.close();
  }
  // « je ne sais pas » : ligne, additions, calcul
  for (const [ch, nom] of [["1:5", "ligne graduée"], ["2:3", "additions"], ["3:7", "calcul rapide"]]) {
    s = await notion("mois", ch, "conseille", "sansLecon&guides=0");
    await toucher(s.page, ".play"); await question(s.page); await pause(s.page, 600);
    await toucher(s.page, ".nsp"); await pause(s.page, 1300);
    await S.shot(s.page, { ecran: `« je ne sais pas » · ${nom}`, etat: "juste après le toucher" });
    await pause(s.page, 3000); await S.shot(s.page, { ecran: `« je ne sais pas » · ${nom}`, etat: "3 s plus tard" });
    await s.context.close();
  }
  await fin(S, s, "Les corrections");
}

// ---------------------------------------------------------------- 6. les leçons, chaque étape
async function lecon(id) {
  const S = new Serie(DIR, `A06-lecon-${id}`, `Partie A · la leçon ${id}, chaque étape`);
  const s = await ouvrir(nav, { base: "neuve", nom: true, params: `lecon=${id}`, voix: "" });
  await toucher(s.page, ".play");
  const t0 = Date.now();
  let vu = 0;
  // une capture 0,8 s après le début de chaque phrase de la leçon, jusqu'à la fin (au plus 4 minutes)
  while (Date.now() - t0 < 240000) {
    const st = await s.page.evaluate(() => ({ n: (window.__dit ?? []).length, fini: window.__lecon !== undefined }));
    if (st.fini) break;
    if (st.n > vu) { vu = st.n; await pause(s.page, 800); await S.shot(s.page, { ecran: `leçon ${id}`, etat: `phrase ${vu}` }); continue; }
    await pause(s.page, 120);
  }
  await pause(s.page, 500);
  await S.shot(s.page, { ecran: `leçon ${id}`, etat: `fin (${Math.round((Date.now() - t0) / 1000)} s, voix réelle)`, note: JSON.stringify(await s.page.evaluate(() => window.__lecon ?? null)) });
  await s.context.close();
  await fin(S, s, `La leçon ${id} (${lecons[id]?.titre ?? lecons[id]?.nom ?? ""})`.replace(" ()", ""));
}

// ---------------------------------------------------------------- 7. le défi record
async function defi() {
  const S = new Serie(DIR, "A07-defi", "Partie A · le défi record (un mois)");
  const s = await ouvrir(nav, { base: "mois", params: "cran=conseille&sans=echauffement,notion" });
  await toucher(s.page, ".play");
  const ok = await attendre(s.page, () => !!window.__app.challenge, null, 30000);
  if (!ok) { await S.shot(s.page, { ecran: "défi record", etat: "le défi n'a pas lieu avec cette base", note: "non capturé" }); }
  else {
    await pause(s.page, 800); await S.shot(s.page, { ecran: "défi record", etat: "l'annonce" });
    await question(s.page); await pause(s.page, 300); await S.shot(s.page, { ecran: "défi record", etat: "première question" });
    for (let k = 0; k < 4; k++) { await juste(s.page); await pause(s.page, 700); }
    await S.shot(s.page, { ecran: "défi record", etat: "après 4 bonnes réponses" });
    await taper(s.page, 99); await pause(s.page, 300); await S.shot(s.page, { ecran: "défi record", etat: "une erreur (99) : la bonne réponse montrée" });
    for (let k = 0; k < 60 && (await s.page.evaluate(() => !!window.__app.challenge)); k++) { if (await s.page.evaluate(() => { const f = window.__app.facts; return !!(f?.q && f.resolve && !f.locked); })) await juste(s.page); await pause(s.page, 800); if (k === 20) await S.shot(s.page, { ecran: "défi record", etat: "au milieu de la minute" }); }
    await pause(s.page, 300); await S.shot(s.page, { ecran: "après le défi", etat: "fin du défi, score et record" });
  }
  await s.context.close();
  await fin(S, s, "Le défi record");
}

// ---------------------------------------------------------------- 8. la récompense
// une séance réduite à la récompense (?sans), avec un trésor de départ ; `prep` : ce qu'il faut forcer (quota atteint, brillante)
async function recompense() {
  const S = new Serie(DIR, "A08-recompense", "Partie A · la récompense (étoiles, coquillage, carte nouvelle, créature rendue brillante, brillante)");
  const cas = [
    ["carte nouvelle", "neuve", 30, null],
    // (au bout d'un mois, les créatures possédées sont souvent déjà toutes brillantes : on en ternit une pour la capture)
    ["quota atteint : une créature rendue brillante", "mois", 30, () => { const R = window.__app.rewards, k = Object.keys(R.owned)[0]; R.quota = () => 0; R.owned = { ...R.owned, [k]: { ...R.owned[k], brillante: false } }; }],
    ["quota atteint, toutes brillantes : le coquillage attend", "mois", 30, () => { const R = window.__app.rewards; R.quota = () => 0; R.owned = Object.fromEntries(Object.entries(R.owned).map(([k, o]) => [k, { ...o, brillante: true }])); }],
    ["brillante", "neuve", 30, () => { const R = window.__app.rewards, o = R.openShell.bind(R); R.openShell = (r, t) => o(() => 0.01, t); }],
  ];
  for (const [nom, base, etoiles, prep] of cas) {
    const s = await ouvrir(nav, { base, nom: true, params: `cran=conseille&sans=echauffement,notion,defi&etoiles=${etoiles}` });
    if (prep) await s.page.evaluate(prep);
    await toucher(s.page, ".play");
    const seen = new Set();
    const t0 = Date.now();
    while (Date.now() - t0 < 60000) {
      const st = await s.page.evaluate(() => ({ tally: !!document.querySelector(".tally"), special: !!document.querySelector(".special"), shell: !!document.querySelector(".shelltap"), card: !!document.querySelector(".card"), flipped: !!document.querySelector(".card.flipped"), check: !!document.querySelector(".check"), moon: !!document.querySelector(".moon"), again: !!document.querySelector(".again") }));
      const key = st.moon || st.again ? "fin" : st.flipped ? "carte" : st.card ? "dos" : st.shell ? "coquillage" : st.special ? "spéciale" : st.tally ? "étoiles" : null;
      if (key && !seen.has(key)) { seen.add(key); await pause(s.page, key === "étoiles" ? 1500 : 900); await S.shot(s.page, { ecran: `récompense (${nom})`, etat: key === "étoiles" ? "le compte des étoiles (séance réduite à la récompense : aucune question, d'où 0 étoile de questions)" : key === "coquillage" ? "le coquillage à toucher" : key === "dos" ? "la carte sort (dos)" : key === "carte" ? "la carte retournée" : key === "spéciale" ? "étoile spéciale" : "fin : la lune" }); }
      if (key === "fin") break;
      if (st.shell && seen.has("coquillage")) await toucher(s.page, ".shelltap");
      else if (st.flipped && st.check) { await pause(s.page, 1500); await toucher(s.page, ".check"); seen.delete("dos"); seen.delete("carte"); seen.delete("coquillage"); }
      await pause(s.page, 250);
    }
    await s.context.close();
  }
  await fin(S, null, "La récompense");
}

// ---------------------------------------------------------------- 9. le récif, l'album, une carte ouverte
async function recifAlbum() {
  const S = new Serie(DIR, "A09-recif-album", "Partie A · le récif, l'album, une carte ouverte");
  for (const base of ["neuve", "mois"]) {
    const B = base === "neuve" ? "base neuve" : "un mois";
    let s = await ouvrir(nav, { base, nom: true });
    await toucher(s.page, ".reefkey"); await pause(s.page, 3000);
    await S.shot(s.page, { ecran: "le récif", etat: B });
    const viv = await recifOuvert(s.page);
    if (viv.length) { await toucherCreature(s.page, viv[0]); await pause(s.page, 2500); await S.shot(s.page, { ecran: "le récif", etat: `${B}, une créature touchée : sa carte` }); await toucher(s.page, ".card"); await pause(s.page, 2000); await S.shot(s.page, { ecran: "le récif", etat: `${B}, la carte touchée (retournée)` }); }
    await s.context.close();
    s = await ouvrir(nav, { base, nom: true });
    await toucher(s.page, ".albumkey"); await pause(s.page, 2500);
    await S.shot(s.page, { ecran: "l'album", etat: B });
    if (await toucher(s.page, ".album-card.got")) { await pause(s.page, 2500); await S.shot(s.page, { ecran: "l'album", etat: `${B}, une carte ouverte` }); await toucher(s.page, ".card"); await pause(s.page, 2000); await S.shot(s.page, { ecran: "l'album", etat: `${B}, la carte retournée (anecdote)` }); await toucher(s.page, ".check"); await pause(s.page, 800); }
    if (await toucher(s.page, ".album-card.back:not(.closed)")) { await pause(s.page, 1500); await S.shot(s.page, { ecran: "l'album", etat: `${B}, le dos d'une carte pas encore gagnée touché` }); }
    if (await toucher(s.page, ".album-card.closed")) { await pause(s.page, 1500); await S.shot(s.page, { ecran: "l'album", etat: `${B}, une carte d'une zone fermée touchée` }); }
    await s.context.close();
  }
  await fin(S, null, "Le récif et l'album");
}

// ---------------------------------------------------------------- 10. l'espace parent
async function parent() {
  const S = new Serie(DIR, "A10-parent", "Partie A · l'espace parent (chaque rubrique ; 2 captures par planche, à pleine taille, pour que le texte reste lisible)", { pleine: true });
  for (const base of ["neuve", "mois"]) {
    const B = base === "neuve" ? "base neuve" : "un mois";
    const s = await ouvrir(nav, { base, nom: true });
    // l'appui long sur le logo
    const box = await s.page.locator(".logo").boundingBox();
    if (base === "neuve") { await s.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await s.page.mouse.down(); await pause(s.page, 800); await S.shot(s.page, { ecran: "accueil", etat: "appui long sur le logo, en cours (0,8 s)" }); await s.page.mouse.up(); }
    s.page.evaluate(() => window.__app.parent.open()).catch(() => {});
    await attendre(s.page, () => document.querySelector(".pa-keys"), null, 10000); await pause(s.page, 500);
    if (base === "neuve") await S.shot(s.page, { ecran: "espace parent", etat: "le code demandé" });
    for (const d of "1234") { await s.page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await pause(s.page, 80); }
    await pause(s.page, 900);
    const tabs = await s.page.$$eval(".pa-tabs button", (bs) => bs.map((b) => b.textContent.trim()));
    for (const tab of tabs) {
      await s.page.click(`.pa-tabs button:has-text("${tab}")`).catch(() => {}); await pause(s.page, 800);
      // une rubrique longue : le haut, puis la suite (défilement de la page de l'espace parent)
      const h = await s.page.evaluate(() => { const el = [...document.querySelectorAll("*")].find((e) => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (!el) return 0; el.dataset.recetteScroll = "1"; return Math.ceil((el.scrollHeight - el.clientHeight) / (el.clientHeight - 60)); });
      await S.shot(s.page, { ecran: `espace parent : ${tab}`, etat: `${B}${h ? `, haut (1/${h + 1})` : ""}` });
      for (let k = 1; k <= Math.min(h, 12); k++) { await s.page.evaluate(() => { const el = document.querySelector("[data-recette-scroll]"); el.scrollTop += el.clientHeight - 60; }); await pause(s.page, 300); await S.shot(s.page, { ecran: `espace parent : ${tab}`, etat: `${B}, suite (${k + 1}/${h + 1})` }); }
    }
    await s.context.close();
  }
  await fin(S, null, "L'espace parent");
}

const THEMES = { accueil, choisir, questions, aides, corrections, lecons: async () => { for (const id of ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"]) await lecon(id); }, defi, recompense, recifAlbum, parent };
const only = opt("--seulement", null)?.split(",");
for (const [k, f] of Object.entries(THEMES)) if (!only || only.includes(k)) { console.log("—", k); try { await f(); } catch (e) { console.log("ÉCHEC", k, e.message); incidents.push(`${k} : l'outil a échoué (${e.message.split("\n")[0]})`); } }
// l'index de la partie (fusionné avec celui d'un lancement précédent, pour les thèmes relancés seuls)
let prev = []; try { prev = JSON.parse(readFileSync(join(DIR, "_index.json"), "utf8")).lignes; } catch { /* premier lancement */ }
const files = new Set(index.map(([f]) => f)), themes = new Set(index.map(([f]) => f.replace(/-\d+\.jpg$/, "")));
const lignes = [...prev.filter(([f]) => !files.has(f) && !themes.has(f.replace(/-\d+\.jpg$/, "")) && f !== "INCIDENTS.md"), ...index].sort((a, b) => a[0].localeCompare(b[0], "fr", { numeric: true }));
if (incidents.length) { const { writeFileSync } = await import("node:fs"); writeFileSync(join(DIR, "INCIDENTS.md"), `# Partie A · incidents relevés pendant les captures\n\n${incidents.map((x) => `- ${x}`).join("\n")}\n`); lignes.push(["INCIDENTS.md", "erreurs de page ou de l'outil relevées pendant les captures"]); }
indexPartie(DIR, "Partie A · les écrans et leurs états", lignes, "Planches de 4 captures (numérotées dans l'ordre). Base neuve et « un mois » (restaurée comme par l'espace parent). Voix accélérée (`?voix=rapide`) sauf pour les leçons (voix réelle, pour capturer chaque étape) ; son coupé. Réglages de test de l'application utilisés : `choix`, `cran`, `sans`, `sansLecon`, `guides`, `lecon`, `etoiles`.");
ecrireIndex();
await nav.close();
