// RECETTE FONCTIONNELLE DU LOT 3, PARTIE C : le comportement au toucher (docs/PROMPT-RECETTE-LOT3.md, session 1).
// Avec Playwright (vrais événements tactiles : Input.dispatchTouchEvent), sur une séance de chaque exercice : toucher
// pendant que la voix parle, deux touchers rapides, toucher à côté, la maison au milieu d'une animation, appui long sur
// chaque pictogramme, rien pendant 60 s à chaque type d'écran, « passer » partout, revenir à l'accueil et reprendre.
// Pour chaque essai : l'état avant et après (capture, ce qui a changé, ce que dit la voix, erreur de page éventuelle),
// consigné dans JOURNAL.md et sur les planches. Voix réelle (pour qu'elle parle vraiment pendant les touchers).
//   node tests/recette-fonctionnelle/c-toucher.mjs [--seulement essai[,essai]] (essais : voir ESSAIS en bas)
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, Serie, attendre, ecrireIndex, indexPartie, navigateur, opt, ouvrir, touchables, toucher } from "./commun.mjs";

const DIR = join(OUT, "C-toucher");
const nav = await navigateur();
const journal = [], index = [];
const EXOS = [["1:5", "ligne graduée niveau 5"], ["2:3", "additions famille 3"], ["3:7", "calcul rapide niveau 7"]];
const pause = (p, ms) => p.waitForTimeout(ms);
// l'état résumé, pour comparer avant et après
const etat = (page) => page.evaluate(async () => {
  const A = window.__app, f = A.facts, l = A.screen, n = (await A.store.all("reponses")).length;
  const inF = !!(f?.q && f.resolve && !f.locked), inL = !!(l?.q && l.resolve && !l.locked);
  const q = inL ? `ligne ${l.q.min}–${l.q.max} ${l.q.format} ${l.q.answer}` : inF ? `${f.q.a} ${f.q.op === "-" ? "−" : "+"} ${f.q.b}${f.q.forme && f.q.forme !== "directe" ? ` (${f.q.forme})` : ""}` : null;
  return { etape: A.frieze?.p?.etape ?? null, question: q, attend: inF || inL, tape: inF ? f.typed ?? "" : null, voix: A.voice.speaking, pause: !!A.enPause, reponses: n, etoiles: A.rewards.total };
});
const diff = (a, b) => {
  const out = [];
  if (a.etape !== b.etape) out.push(`étape ${a.etape ?? "—"} → ${b.etape ?? "—"}`);
  if (a.question !== b.question) out.push(`question « ${a.question ?? "—"} » → « ${b.question ?? "—"} »`);
  if (a.attend !== b.attend) out.push(b.attend ? "attend une réponse" : "n'attend plus de réponse");
  if (a.tape !== b.tape && b.tape != null) out.push(`ardoise « ${a.tape ?? ""} » → « ${b.tape} »`);
  if (b.reponses !== a.reponses) out.push(`${b.reponses - a.reponses} réponse(s) enregistrée(s)`);
  if (b.etoiles !== a.etoiles) out.push(`étoiles ${a.etoiles} → ${b.etoiles}`);
  if (a.pause !== b.pause) out.push(b.pause ? "en pause" : "reprise");
  if (a.voix !== b.voix) out.push(b.voix ? "la voix parle" : "la voix s'est tue");
  return out.length ? out.join(" ; ") : "rien ne change";
};
const ditDepuis = async (page) => page.evaluate(() => { const d = window.__dit ?? [], i = window.__vu2 ?? 0; window.__vu2 = d.length; return d.slice(i).map((x) => `« ${x.t} »`).join(" "); });
// un essai : `action` joue le geste ; capture avant et après, ce qui change, erreurs de page nouvelles
async function essai(S, s, { essai: nom, exo, geste, attente = 1500, action }) {
  const page = s.page; await ditDepuis(page);
  const e0 = s.errors.length, a = await etat(page);
  const avant = await S.shot(page, { ecran: `${nom} · ${exo}`, etat: `AVANT : ${geste}` });
  await action(page); await pause(page, attente);
  const b = await etat(page), dit = await ditDepuis(page), err = s.errors.slice(e0);
  await S.shot(page, { ecran: `${nom} · ${exo}`, etat: `APRÈS (${attente / 1000} s) : ${diff(a, b)}`, note: err.length ? `ERREUR DE PAGE : ${err.join(" | ")}` : "" });
  journal.push({ essai: nom, exo, geste, resultat: diff(a, b), dit: dit || "(rien)", erreurs: err.join(" | ") || "aucune", capture: `${S.prefix} n° ${S.items.indexOf(avant) + 1}–${S.items.indexOf(avant) + 2}` });
  return b;
}
// les vrais gestes tactiles
const cdp = new WeakMap();
async function touch(page, type, x, y) { let c = cdp.get(page); if (!c) { c = await page.context().newCDPSession(page); cdp.set(page, c); } await c.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] }); }
const tap = async (page, x, y) => { await touch(page, "touchStart", x, y); await touch(page, "touchEnd", x, y); };
const centre = async (page, sel) => { const b = await page.locator(sel).first().boundingBox().catch(() => null); return b ? [b.x + b.width / 2, b.y + b.height / 2] : null; };
const question = (page, ms = 60000) => attendre(page, () => { const A = window.__app; return [A.screen, A.facts].some((s) => s && s.q && s.resolve && !s.locked); }, null, ms);
const parle = (page, ms = 20000) => attendre(page, () => window.__app.voice.speaking, null, ms);
async function juste(page) {
  const st = await page.evaluate(() => { const A = window.__app, l = A.screen, f = A.facts; if (l?.q && l.resolve && !l.locked) return { l: true, f: l.q.format, a: l.q.answer }; if (f?.q && f.resolve && !f.locked) { const q = f.q; return { l: false, a: q.format === "ecrire" ? q.answer : q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n ?? q.a + q.b }; } return null; });
  if (!st) return null;
  if (st.l && (st.f === "lire" || st.f === "sauter")) await toucher(page, `.answer[data-value="${st.a}"]`);
  else if (st.l) await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
  else { for (const d of String(st.a)) await toucher(page, `.key[data-key="${d}"]`); await toucher(page, '.key[data-key="valider"]'); }
  return st;
}
const bonne = (page) => page.evaluate(() => { const A = window.__app, l = A.screen, f = A.facts; if (l?.q && l.resolve && !l.locked) return { l: true, f: l.q.format, a: l.q.answer }; const q = f?.q; return q ? { l: false, a: q.format === "ecrire" ? q.answer : q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n ?? q.a + q.b } : null; });
const seance = (exo, extra = "") => ouvrir(nav, { base: "mois", nom: true, voix: "", params: `choix=${exo}&cran=conseille&sans=echauffement,defi&sansLecon&guides=0${extra ? `&${extra}` : ""}` });
// avancer jusqu'à une question qui se lit à la bulle (ligne : lire/sauter) si `bulle`
async function prochaine(page, { bulle = false, max = 8 } = {}) {
  for (let k = 0; k < max; k++) { if (!(await question(page))) return false; const b = await bonne(page); if (!bulle || !b.l || b.f === "lire" || b.f === "sauter") return true; await juste(page); await pause(page, 400); }
  return false;
}

// ---------------------------------------------------------------- 1. pendant que la voix parle ; 2. deux touchers rapides ; 3. à côté
async function touchers() {
  for (const [exo, nomExo] of EXOS) {
    const S = new Serie(DIR, `C1-touchers-${exo.replace(":", "-")}`, `Partie C · toucher pendant la voix, deux touchers rapides, à côté : ${nomExo}`);
    const s = await seance(exo); await toucher(s.page, ".play");
    const page = s.page;
    // pendant la consigne : la bonne réponse touchée dès que la voix commence la question
    await attendre(page, () => { const A = window.__app; return [A.screen, A.facts].some((x) => x && x.q && x.resolve) && A.voice.speaking; }, null, 60000);
    await pause(page, 300);
    const b1 = await bonne(page);
    await essai(S, s, { essai: "toucher pendant la voix", exo: nomExo, geste: `la bonne réponse (${b1?.a}) touchée pendant la consigne`, attente: 2500, action: async (p) => { if (b1?.l) { const c = await centre(p, `.answer[data-value="${b1.a}"]`); if (c) await tap(p, ...c); } else if (b1) { for (const d of String(b1.a)) { const c = await centre(p, `.key[data-key="${d}"]`); await tap(p, ...c); } const c = await centre(p, '.key[data-key="valider"]'); await tap(p, ...c); } } });
    // pendant le « bravo » ou la correction : un chiffre du pavé, une bulle
    await pause(page, 200);
    await essai(S, s, { essai: "toucher pendant la voix", exo: nomExo, geste: "le pavé ou une bulle touchés pendant le retour (« bravo » ou correction)", attente: 2000, action: async (p) => { const c = (await centre(p, '.key[data-key="5"]')) ?? (await centre(p, ".answer")); if (c) await tap(p, ...c); } });
    // deux touchers rapides sur la même bulle (bonne réponse), puis sur la même touche du pavé
    await prochaine(page, { bulle: true }); await pause(page, 600);
    const b2 = await bonne(page);
    await page.evaluate(() => { const f = window.__app.facts; if (f && !f.locked) { f.typed = ""; f.slate?.repaint?.(); } }); // (l'ardoise vide avant l'essai)
    await essai(S, s, { essai: "deux touchers rapides", exo: nomExo, geste: b2?.l ? `deux touchers à 60 ms sur la bulle ${b2.a} (bonne réponse)` : `deux touchers à 60 ms sur la touche ${String(b2?.a)[0]} du pavé`, attente: 1200, action: async (p) => { const c = b2?.l ? await centre(p, `.answer[data-value="${b2.a}"]`) : await centre(p, `.key[data-key="${String(b2?.a)[0]}"]`); if (c) { await tap(p, ...c); await pause(p, 60); await tap(p, ...c); } } });
    if (!b2?.l) {
      await page.evaluate(() => { const f = window.__app.facts; if (f && !f.locked) { f.typed = ""; f.slate?.repaint?.(); } });
      const b3 = await bonne(page);
      await essai(S, s, { essai: "deux touchers rapides", exo: nomExo, geste: `la bonne réponse (${b3?.a}) tapée, puis deux touchers à 60 ms sur « valider »`, attente: 2500, action: async (p) => { for (const d of String(b3.a)) await toucher(p, `.key[data-key="${d}"]`); const c = await centre(p, '.key[data-key="valider"]'); await tap(p, ...c); await pause(p, 60); await tap(p, ...c); } });
    } else {
      await prochaine(page, { bulle: true }); await pause(page, 600);
      const b3 = await bonne(page), faux = await page.evaluate((a) => [...document.querySelectorAll(".answer")].map((x) => x.dataset.value).find((v) => Number(v) !== a), b3?.a);
      await essai(S, s, { essai: "deux touchers rapides", exo: nomExo, geste: `deux touchers à 60 ms sur une mauvaise bulle (${faux})`, attente: 2500, action: async (p) => { const c = await centre(p, `.answer[data-value="${faux}"]`); if (c) { await tap(p, ...c); await pause(p, 60); await tap(p, ...c); } } });
    }
    // à côté des cibles : le ciel, le sable, entre deux cibles, juste au bord d'une bulle
    await prochaine(page, { bulle: true }); await pause(page, 1500);
    for (const [ou, xy] of [["le ciel (640, 120)", [640, 120]], ["le sable (300, 760)", [300, 760]], ["la pieuvre (200, 200)", [200, 200]]]) await essai(S, s, { essai: "toucher à côté", exo: nomExo, geste: `un toucher sur ${ou}`, attente: 1200, action: (p) => tap(p, ...xy) });
    const bb = await page.evaluate(() => { const e = [...document.querySelectorAll(".answer, .key")].find((x) => getComputedStyle(x).visibility !== "hidden"); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, h: r.height, v: e.dataset.value ?? e.dataset.key }; });
    if (bb) await essai(S, s, { essai: "toucher à côté", exo: nomExo, geste: `un toucher à 5 px à gauche de la bulle ou touche « ${bb.v} » (hors de sa boîte)`, attente: 1500, action: (p) => tap(p, bb.x - 5, bb.y + bb.h / 2) });
    if (s.errors.length) journal.push({ essai: "(fin de séance)", exo: nomExo, geste: "", resultat: "", dit: "", erreurs: s.errors.join(" | "), capture: "" });
    await s.context.close();
    for (const p of await S.planches(nav)) index.push([p.file, `toucher pendant la voix, deux touchers rapides, à côté (${nomExo}) : ${p.contenu}`]);
  }
}

// ---------------------------------------------------------------- 4. la maison au milieu d'une animation ; 8. revenir à l'accueil et reprendre
async function maison() {
  for (const [exo, nomExo] of EXOS) {
    const S = new Serie(DIR, `C2-maison-${exo.replace(":", "-")}`, `Partie C · la maison au milieu d'une animation, revenir à l'accueil et reprendre : ${nomExo}`);
    const s = await seance(exo), page = s.page; await toucher(page, ".play");
    await question(page); await pause(page, 500);
    // une erreur, puis la maison pendant l'animation de la correction
    const b = await bonne(page);
    if (b.l && (b.f === "lire" || b.f === "sauter")) { const v = await page.evaluate((a) => [...document.querySelectorAll(".answer")].map((x) => x.dataset.value).find((x) => Number(x) !== a), b.a); await toucher(page, `.answer[data-value="${v}"]`); }
    else if (b.l) await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.min + s.q.max - s.q.answer === s.q.answer ? s.q.answer + s.q.step : s.q.min + s.q.max - s.q.answer, null); });
    else { for (const d of String(b.a + 1)) await toucher(page, `.key[data-key="${d}"]`); await toucher(page, '.key[data-key="valider"]'); }
    await pause(page, 1800);
    await essai(S, s, { essai: "maison pendant une animation", exo: nomExo, geste: "la maison touchée 1,8 s après une erreur (correction animée en cours)", attente: 2000, action: async (p) => { const c = await centre(p, ".session-home"); if (c) await tap(p, ...c); } });
    await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: nomExo, geste: "« continuer » touché sur l'accueil en pause", attente: 4000, action: async (p) => { const c = await centre(p, ".play"); if (c) await tap(p, ...c); } });
    // la maison pendant le « bravo » d'une bonne réponse, puis le récif, puis continuer
    await question(page); await pause(page, 300); await juste(page); await pause(page, 250);
    await essai(S, s, { essai: "maison pendant une animation", exo: nomExo, geste: "la maison touchée 0,25 s après une bonne réponse (« bravo », étoile qui s'envole)", attente: 1500, action: async (p) => { const c = await centre(p, ".session-home"); if (c) await tap(p, ...c); } });
    await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: nomExo, geste: "depuis l'accueil en pause : le récif", attente: 3000, action: async (p) => { const c = await centre(p, ".reefkey"); if (c) await tap(p, ...c); } });
    await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: nomExo, geste: "la maison du récif (retour à l'accueil en pause)", attente: 2500, action: async (p) => { const c = await centre(p, ".homekey:not(.session-home)"); if (c) await tap(p, ...c); } });
    await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: nomExo, geste: "« continuer »", attente: 4000, action: async (p) => { const c = await centre(p, ".play"); if (c) await tap(p, ...c); } });
    // la maison au milieu d'une phrase de consigne
    await attendre(page, () => { const A = window.__app; return [A.screen, A.facts].some((x) => x && x.q && x.resolve) && A.voice.speaking; }, null, 30000);
    await essai(S, s, { essai: "maison pendant une animation", exo: nomExo, geste: "la maison touchée pendant la consigne (la voix parle)", attente: 1500, action: async (p) => { const c = await centre(p, ".session-home"); if (c) await tap(p, ...c); } });
    await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: nomExo, geste: "« continuer » (la consigne est-elle redite ?)", attente: 5000, action: async (p) => { const c = await centre(p, ".play"); if (c) await tap(p, ...c); } });
    await s.context.close();
    for (const p of await S.planches(nav)) index.push([p.file, `la maison et la reprise (${nomExo}) : ${p.contenu}`]);
  }
  // la maison pendant une leçon (L1, base neuve) et pendant l'exemple guidé qui suit
  const S = new Serie(DIR, "C2-maison-lecon", "Partie C · la maison pendant une leçon, puis reprendre");
  const s = await ouvrir(nav, { base: "neuve", nom: true, voix: "", params: "choix=1:1&cran=conseille&sans=echauffement,defi" }), page = s.page;
  await toucher(page, ".play"); await attendre(page, () => !!document.querySelector(".lessonkey"), null, 30000); await pause(page, 6000);
  await essai(S, s, { essai: "maison pendant une animation", exo: "leçon L1", geste: "la maison touchée 6 s après le début de la leçon", attente: 2000, action: async (p) => { const c = await centre(p, ".session-home"); if (c) await tap(p, ...c); } });
  await essai(S, s, { essai: "revenir à l'accueil et reprendre", exo: "leçon L1", geste: "« continuer »", attente: 5000, action: async (p) => { const c = await centre(p, ".play"); if (c) await tap(p, ...c); } });
  await s.context.close();
  for (const p of await S.planches(nav)) index.push([p.file, `la maison pendant une leçon : ${p.contenu}`]);
}

// ---------------------------------------------------------------- 5. appui long sur chaque pictogramme
async function appuiLong() {
  const S = new Serie(DIR, "C3-appui-long", "Partie C · appui long (1,5 s) sur chaque pictogramme");
  const long = async (p, sel) => { const c = await centre(p, sel); if (!c) return; await touch(p, "touchStart", ...c); await pause(p, 1500); await touch(p, "touchEnd", ...c); };
  // l'accueil
  let s = await ouvrir(nav, { base: "mois", nom: true, voix: "" });
  for (const [sel, nom] of [[".play", "jouer"], [".choisir", "choisir"], [".speaker", "réécouter"]]) {
    await essai(S, s, { essai: "appui long", exo: "accueil", geste: `appui long sur « ${nom} »`, attente: 1500, action: (p) => long(p, sel) });
    if (sel !== ".speaker") { await s.context.close(); s = await ouvrir(nav, { base: "mois", nom: true, voix: "" }); }
  }
  await s.context.close();
  // pendant une question : chaque pictogramme
  for (const [exo, nomExo] of EXOS) {
    s = await seance(exo); await toucher(s.page, ".play"); await question(s.page); await pause(s.page, 3000);
    const sels = await s.page.evaluate(() => [[".speaker", "réécouter"], [".help", "aide (coquillage)"], [".nsp", "je ne sais pas"], [".answer", "une bulle-réponse"], ['.key[data-key="effacer"]', "effacer"], [".session-home", "maison"]].filter(([c]) => { const e = document.querySelector(c); return e && getComputedStyle(e).visibility !== "hidden"; }));
    for (const [sel, nom] of sels) {
      if (!(await question(s.page, 20000))) break;
      await essai(S, s, { essai: "appui long", exo: nomExo, geste: `appui long sur « ${nom} »`, attente: 2000, action: (p) => long(p, sel) });
      if (sel === ".session-home") { const c = await centre(s.page, ".play"); if (c) await tap(s.page, ...c); await pause(s.page, 1500); }
      if (sel === ".help") await pause(s.page, 6000);
      if (sel === ".nsp" || sel === ".answer") await pause(s.page, 3000);
    }
    await s.context.close();
  }
  // le logo de l'espace parent (la seule commande à appui long voulu)
  s = await ouvrir(nav, { base: "mois", nom: true, voix: "" });
  await essai(S, s, { essai: "appui long", exo: "accueil", geste: "appui long sur le logo (espace parent), 1,5 s", attente: 1000, action: (p) => long(p, ".logo") });
  await s.context.close();
  for (const p of await S.planches(nav)) index.push([p.file, `appui long sur les pictogrammes : ${p.contenu}`]);
}

// ---------------------------------------------------------------- 6. ne rien faire pendant 60 s à chaque type d'écran
async function rien() {
  const S = new Serie(DIR, "C4-rien-60s", "Partie C · ne rien faire pendant 60 s, à chaque type d'écran");
  const ecrans = [
    ["accueil", { base: "mois", nom: true }, async () => {}],
    ["choix du nom (premier lancement)", { base: "neuve" }, async (p) => { await toucher(p, ".play"); await attendre(p, () => document.querySelector(".name")); }],
    ["choisir : les exercices", { base: "mois", nom: true }, async (p) => { await toucher(p, ".choisir"); await attendre(p, () => document.querySelector(".choix-ex")); }],
    ["choisir : les niveaux de la ligne", { base: "mois", nom: true }, async (p) => { await toucher(p, ".choisir"); await attendre(p, () => document.querySelector(".choix-ex")); await pause(p, 3000); await toucher(p, '.choix-ex[aria-label="ligne"]'); await attendre(p, () => document.querySelector(".choix-tuile")); }],
    ["sélecteur de difficulté", { base: "mois", nom: true }, async (p) => { await toucher(p, ".play"); await attendre(p, () => document.querySelector(".cran")); }],
    ["échauffement : une question", { base: "mois", nom: true, params: "cran=conseille" }, async (p) => { await toucher(p, ".play"); await question(p); }],
    ["ligne graduée : une question", { base: "mois", nom: true, params: "choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0" }, async (p) => { await toucher(p, ".play"); await question(p); }],
    ["additions : une question", { base: "mois", nom: true, params: "choix=2:3&cran=conseille&sans=echauffement&sansLecon&guides=0" }, async (p) => { await toucher(p, ".play"); await question(p); }],
    ["calcul rapide : une question", { base: "mois", nom: true, params: "choix=3:7&cran=conseille&sans=echauffement&sansLecon&guides=0" }, async (p) => { await toucher(p, ".play"); await question(p); }],
    ["leçon L1 : pendant la leçon", { base: "neuve", nom: true, params: "lecon=L1" }, async (p) => { await toucher(p, ".play"); await pause(p, 1500); }],
    ["accueil en pause", { base: "mois", nom: true, params: "choix=1:5&cran=conseille&sans=echauffement&sansLecon&guides=0" }, async (p) => { await toucher(p, ".play"); await question(p); await toucher(p, ".session-home"); }],
    ["récompense : le coquillage", { base: "neuve", nom: true, params: "cran=conseille&sans=echauffement,notion,defi&etoiles=30" }, async (p) => { await toucher(p, ".play"); await attendre(p, () => document.querySelector(".shelltap"), null, 60000); }],
    ["récompense : la carte retournée", { base: "neuve", nom: true, params: "cran=conseille&sans=echauffement,notion,defi&etoiles=30" }, async (p) => { await toucher(p, ".play"); await attendre(p, () => document.querySelector(".shelltap"), null, 60000); await pause(p, 1000); await toucher(p, ".shelltap"); await attendre(p, () => document.querySelector(".card.flipped"), null, 30000); }],
    ["fin de séance : la lune", { base: "neuve", nom: true, params: "cran=conseille&sans=echauffement,notion,defi" }, async (p) => { await toucher(p, ".play"); await attendre(p, () => document.querySelector(".moon"), null, 90000); }],
    ["le récif", { base: "mois", nom: true }, async (p) => { await toucher(p, ".reefkey"); }],
    ["l'album", { base: "mois", nom: true }, async (p) => { await toucher(p, ".albumkey"); }],
    ["espace parent", { base: "mois", nom: true }, async (p) => { p.evaluate(() => window.__app.parent.open()).catch(() => {}); await attendre(p, () => document.querySelector(".pa-keys")); for (const d of "1234") { await p.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await pause(p, 80); } }],
  ];
  // toutes les pages en même temps : chacune va à son écran, puis 60 s d'attente commune
  const runs = await Promise.all(ecrans.map(async ([nom, o, go]) => { const s = await ouvrir(nav, { ...o, voix: "" }); await go(s.page); await pause(s.page, 1500); return { nom, s }; }));
  for (const r of runs) { r.a = await etat(r.s.page); r.e0 = r.s.errors.length; await ditDepuis(r.s.page); await S.shot(r.s.page, { ecran: r.nom, etat: "AVANT : l'enfant ne touche plus rien" }); }
  await pause(runs[0].s.page, 60000);
  for (const r of runs) {
    const b = await etat(r.s.page), dit = await ditDepuis(r.s.page), err = r.s.errors.slice(r.e0);
    await S.shot(r.s.page, { ecran: r.nom, etat: `APRÈS 60 s sans toucher : ${diff(r.a, b)}`, voix: dit || "(rien dit pendant les 60 s)", note: err.length ? `ERREUR DE PAGE : ${err.join(" | ")}` : "" });
    journal.push({ essai: "rien pendant 60 s", exo: r.nom, geste: "aucun toucher pendant 60 s", resultat: diff(r.a, b), dit: dit || "(rien)", erreurs: err.join(" | ") || "aucune", capture: `C4-rien-60s n° ${S.items.length - 1}–${S.items.length}` });
  }
  // (l'ordre des captures : avant de toutes, puis après de toutes ; on les remet par paires)
  const n = runs.length, av = S.items.slice(0, n), ap = S.items.slice(n); S.items = av.flatMap((x, i) => [x, ap[i]]);
  journal.filter((j) => j.essai === "rien pendant 60 s").forEach((j, i) => { j.capture = `C4-rien-60s n° ${2 * i + 1}–${2 * i + 2}`; });
  for (const r of runs) await r.s.context.close();
  for (const p of await S.planches(nav)) index.push([p.file, `rien pendant 60 s : ${p.contenu}`]);
}

// ---------------------------------------------------------------- 7. « passer » partout
async function passer() {
  const S = new Serie(DIR, "C5-passer", "Partie C · enchaîner « passer » partout (échauffement, leçon, exemples, corrections)");
  for (const [exo, nomExo, base] of [["1:1", "ligne graduée niveau 1 (leçon L1)", "neuve"], ["2:2", "additions famille 2 (leçon L4)", "neuve"], ["3:2", "calcul rapide niveau 2 (leçon L7)", "neuve"]]) {
    const s = await ouvrir(nav, { base, nom: true, voix: "", params: `choix=${exo}&cran=conseille` }), page = s.page;
    await toucher(page, ".play");
    const t0 = Date.now(); let n = 0, faux = 0;
    while (Date.now() - t0 < 240000 && n < 10) {
      await pause(page, 200);
      const st = await page.evaluate(() => ({ skip: (() => { const e = document.querySelector(".skip, .lessonkey:not(.rejouer)"); return e && getComputedStyle(e).visibility !== "hidden" ? e.getAttribute("aria-label") : null; })(), q: [window.__app.screen, window.__app.facts].some((x) => x && x.q && x.resolve && !x.locked), etape: window.__app.frieze?.p?.etape, fin: !!document.querySelector(".tally, .moon") }));
      if (st.fin) break;
      if (st.skip) {
        n++; const sel = (await page.$(".skip")) ? ".skip" : ".lessonkey:not(.rejouer)";
        await essai(S, s, { essai: "passer partout", exo: nomExo, geste: `« ${st.skip} » touché (étape ${st.etape})`, attente: 1500, action: async (p) => { const c = await centre(p, sel); if (c) await tap(p, ...c); } });
        continue;
      }
      // une question : une erreur (pour voir « passer la correction »), une fois sur deux
      if (st.q) { if (faux++ % 2 === 0) { const b = await bonne(page); if (b.l && (b.f === "lire" || b.f === "sauter")) { const v = await page.evaluate((a) => [...document.querySelectorAll(".answer")].map((x) => x.dataset.value).find((x) => Number(x) !== a), b.a); await toucher(page, `.answer[data-value="${v}"]`); } else if (b.l) await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.min, null); }); else { for (const d of String(b.a + 1)) await toucher(page, `.key[data-key="${d}"]`); await toucher(page, '.key[data-key="valider"]'); } } else await juste(page); await pause(page, 900); }
    }
    await s.context.close();
  }
  for (const p of await S.planches(nav)) index.push([p.file, `« passer » partout : ${p.contenu}`]);
}

const ESSAIS = { touchers, maison, appuiLong, rien, passer };
const only = opt("--seulement", null)?.split(",");
for (const [k, f] of Object.entries(ESSAIS)) if (!only || only.includes(k)) { console.log("—", k); try { await f(); } catch (e) { console.log("ÉCHEC", k, e.stack); journal.push({ essai: k, exo: "", geste: "", resultat: `l'outil a échoué : ${e.message.split("\n")[0]}`, dit: "", erreurs: "", capture: "" }); } }
// le journal (fusionné avec celui d'un lancement précédent pour les essais relancés seuls)
let prev = { journal: [], index: [] }; try { prev = JSON.parse(readFileSync(join(DIR, "_journal.json"), "utf8")); } catch { /* premier lancement */ }
const essais = new Set(journal.map((j) => j.essai)), fichiers = new Set(index.map(([f]) => f.replace(/-\d+\.jpg$/, "")));
const J = [...prev.journal.filter((j) => !essais.has(j.essai)), ...journal], I = [...prev.index.filter(([f]) => !fichiers.has(f.replace(/-\d+\.jpg$/, ""))), ...index];
writeFileSync(join(DIR, "_journal.json"), JSON.stringify({ journal: J, index: I }, null, 1));
const cell = (x) => String(x ?? "").replace(/\|/g, "/").replace(/\n/g, " ");
writeFileSync(join(DIR, "JOURNAL.md"), ["# Partie C · le comportement au toucher : journal", "", "Chaque essai : le geste, ce qui change entre avant et après (étape, question, ardoise, réponses enregistrées, étoiles, pause, voix), ce que dit la voix pendant ce temps, les erreurs de page. Gestes tactiles réels (Input.dispatchTouchEvent), voix réelle ; entre deux essais sur le pavé, l'outil vide l'ardoise (pour partir d'une ardoise vide) ; base « un mois » (base neuve pour les leçons, le nom de la pieuvre et la récompense). Captures avant et après sur les planches indiquées.", "",
  "| essai | exercice ou écran | geste | ce qui se passe | dit par la voix | erreur de page | captures |", "| --- | --- | --- | --- | --- | --- | --- |",
  ...J.map((j) => `| ${cell(j.essai)} | ${cell(j.exo)} | ${cell(j.geste)} | ${cell(j.resultat)} | ${cell(j.dit)} | ${cell(j.erreurs)} | ${cell(j.capture)} |`), ""].join("\n"));
indexPartie(DIR, "Partie C · le comportement au toucher", [["JOURNAL.md", "le journal de tous les essais (geste, ce qui se passe, voix, erreurs, renvoi aux captures)"], ...I.sort((a, b) => a[0].localeCompare(b[0], "fr", { numeric: true }))], "Chaque essai a une capture AVANT et une capture APRÈS (numérotées sur la planche). Commencer par `JOURNAL.md`.");
ecrireIndex();
await nav.close();
