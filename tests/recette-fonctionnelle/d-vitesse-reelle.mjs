// RECETTE FONCTIONNELLE DU LOT 3, PARTIE D : une séance à vitesse réelle par exercice (docs/PROMPT-RECETTE-LOT3.md,
// session 1). Le même enfant que tests/e2e/recette.mjs (voix réelle, première séance, réponse `--delai` secondes après
// pouvoir répondre ; « je ne sais pas » à la 3e addition et à la 4e question de la ligne, une erreur à la 5e addition et à
// la 6e question de la ligne ; les bulles hors questions touchées au bout de 2 s), avec en plus le relevé de ce que dit
// la voix. Produit, pour chaque séance : la chronologie (ce qui est dit, affiché, attendu, et la durée de chaque moment),
// les attentes sans rien à toucher, la durée totale, et une planche des moments clés.
//   node tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas ligne|additions|calcul|famille3 [--delai 4.5]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, Serie, navigateur, opt, ouvrir, touchables } from "./commun.mjs";

const CAS = { ligne: ["module=1", "ligne graduée (module 1)"], additions: ["module=2", "additions (module 2)"], calcul: ["module=3", "calcul rapide (module 3)"], famille3: ["choix=2:3", "additions, famille 3 choisie"] };
const cas = opt("--cas", "ligne"), [params, nom] = CAS[cas], DELAI = Math.round(Number(opt("--delai", "4.5")) * 1000);
const DIR = join(OUT, "D-vitesse-reelle"); mkdirSync(DIR, { recursive: true });
const nav = await navigateur();
const s = await ouvrir(nav, { base: "neuve", voix: "", params }), page = s.page;
const S = new Serie(DIR, `D-${cas}`, `Partie D · séance à vitesse réelle : ${nom} (réponse ${DELAI / 1000} s après pouvoir répondre)`);
const T0 = Date.now(), now = () => (Date.now() - T0) / 1000;
// l'état vu par l'enfant
const state = () => page.evaluate(() => {
  const A = window.__app, f = A.facts, l = A.screen;
  const inF = !!(f?.q && f.resolve && !f.locked), inL = !!(l?.q && l.resolve && !l.locked);
  const qf = f?.q, ql = l?.q;
  const shown = inL || (ql && l?.resolve) ? `ligne ${ql.min}–${ql.max} (${ql.format}${ql.format === "lire" ? `, étoile sur ${ql.answer}` : ql.format === "sauter" ? "" : ` ${ql.answer}`})` : qf && f?.resolve ? (qf.module === 3 ? `${qf.a} ${qf.op === "-" ? "−" : "+"} ${qf.forme === "trouDroite" ? "?" : qf.b} = ${qf.forme === "trouDroite" ? qf.n : "?"}` : `${qf.forme === "trouGauche" ? "?" : qf.a} + ${qf.forme === "trouDroite" ? "?" : qf.b} = ${qf.forme === "directe" || !qf.forme ? "?" : qf.a + qf.b}`) : null;
  const dit = window.__dit ?? [];
  return { etape: A.frieze?.p?.etape ?? null, inF, inL, shown, voix: A.voice.speaking, n: dit.length, lecon: !!document.querySelector(".lessonkey"), defi: !!A.challenge };
});
const rows = [], idle = [], said = [];
let last = null, idleStart = null, idleSaid = [];
const HUD = /^(réécouter|maison|espace parent)/;
async function observe() {
  const st = await state(), t = now();
  const dit = await page.evaluate((i) => (window.__dit ?? []).slice(i).map((x) => x.t), said.length);
  for (const d of dit) said.push({ t, d });
  // (hors question, les bulles-réponses, le pavé, la bande, « je ne sais pas » et le coquillage restent à l'écran mais sont bloqués :
  // un toucher n'y fait rien ; ils ne comptent pas comme « à toucher »)
  const bloque = (x) => !(st.inF || st.inL) && /^(pavé|bulles-réponses|bande de la ligne|je ne sais pas|aide$)/.test(x);
  const tch = (await touchables(page)).filter((x) => !HUD.test(x) && !bloque(x));
  const attendu = st.inF || st.inL ? `répondre (${tch.filter((x) => /pavé|bulles|bande|je ne sais/.test(x)).join(" ; ") || "?"})` : tch.length ? `toucher : ${tch.join(" ; ")}` : "rien à toucher";
  const sig = JSON.stringify([st.etape, st.shown, attendu, st.lecon, st.defi]);
  if (sig !== last?.sig) {
    if (last) last.fin = t;
    last = { t, fin: null, sig, etape: st.etape ?? "accueil", affiche: st.shown ?? (st.lecon ? "leçon animée" : st.defi ? "défi record" : "—"), attendu, dit: [...dit] };
    rows.push(last);
  } else last.dit.push(...dit);
  // les attentes sans rien à toucher (hors réécouter, maison, espace parent)
  if (attendu === "rien à toucher") { if (idleStart === null) { idleStart = t; idleSaid = []; } idleSaid.push(...dit); }
  else if (idleStart !== null) { idle.push({ de: idleStart, a: t, etape: st.etape, dit: idleSaid }); idleStart = null; }
  return { st, tch };
}
const tapSel = (sel) => page.tap(sel, { force: true }).catch(() => {});
const typeIn = async (n) => { for (const d of String(n)) await tapSel(`.key[data-key="${d}"]`); await tapSel('.key[data-key="valider"]'); };
await S.shot(page, { ecran: "accueil", etat: "avant « jouer »" });
await tapSel(".play");
let nf = 0, nl = 0, lastAct = Date.now(), prevEtape = null, firstQ = new Set(), answerAt = null;
const deadline = Date.now() + 18 * 60000;
while (Date.now() < deadline) {
  await page.waitForTimeout(250);
  const { st, tch } = await observe();
  if (st.etape !== prevEtape) { prevEtape = st.etape; await S.shot(page, { ecran: `étape ${st.etape ?? "(hors séance)"}`, etat: `t = ${now().toFixed(0)} s, début de l'étape` }); }
  if (st.inF || st.inL) {
    answerAt ??= Date.now() + DELAI;
    if (Date.now() < answerAt) continue;
    answerAt = null;
    const k = `${st.etape}:${st.inL ? "l" : "f"}`; if (!firstQ.has(k)) { firstQ.add(k); await S.shot(page, { ecran: `${st.etape} : première question`, etat: `t = ${now().toFixed(0)} s` }); }
    if (st.inF) {
      const q = await page.evaluate(() => { const f = window.__app.facts.q; return f ? (f.format === "ecrire" ? f.answer : f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.n ?? f.a + f.b) : null; });
      if (q === null) continue;
      nf++;
      if (nf === 3) { await tapSel(".nsp"); await page.waitForTimeout(800); await S.shot(page, { ecran: `${st.etape} : « je ne sais pas »`, etat: `t = ${now().toFixed(0)} s` }); }
      else if (nf === 5) { await typeIn(q + 1); await page.waitForTimeout(800); await S.shot(page, { ecran: `${st.etape} : une erreur`, etat: `t = ${now().toFixed(0)} s, réponse ${q + 1}` }); }
      else await typeIn(q);
    } else {
      nl++; const q = await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer }));
      if (nl === 4) { await tapSel(".nsp"); await page.waitForTimeout(800); await S.shot(page, { ecran: "ligne : « je ne sais pas »", etat: `t = ${now().toFixed(0)} s` }); }
      else if (nl === 6) {
        const v = q.f === "lire" || q.f === "sauter" ? await page.evaluate(() => [...document.querySelectorAll(".answer")].find((x) => Number(x.dataset.value) !== window.__app.screen.q.answer)?.dataset.value) : null;
        if (v) await tapSel(`.answer[data-value="${v}"]`); else await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.answer + 3, null); });
        await page.waitForTimeout(800); await S.shot(page, { ecran: "ligne : une erreur", etat: `t = ${now().toFixed(0)} s` });
      } else if (q.f === "lire" || q.f === "sauter") await tapSel(`.answer[data-value="${q.a}"]`);
      else if (q.f === "ecrire") await typeIn(q.a);
      else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
    }
    lastAct = Date.now(); continue;
  }
  answerAt = null;
  // bulles hors questions (nom, cran, coquillage, carte, « c'est bon ») : l'enfant touche au bout de 2 s
  const inv = tch.find((x) => /^(noms proposés|valider|c'est bon|le coquillage|coquillage|crans)/.test(x)) ?? (await page.evaluate(() => [".shelltap", ".name", ".check"].find((c) => { const e = document.querySelector(c); return e && getComputedStyle(e).visibility !== "hidden"; }) ?? null));
  if (inv && Date.now() - lastAct > 2000) {
    const sel = /noms/.test(inv) || inv === ".name" ? ".name" : /coquillage/.test(inv) || inv === ".shelltap" ? ".shelltap" : ".check";
    if (sel === ".shelltap") await S.shot(page, { ecran: "récompense : le coquillage", etat: `t = ${now().toFixed(0)} s` });
    if (sel === ".check" && (await page.$(".card.flipped"))) await S.shot(page, { ecran: "récompense : la carte", etat: `t = ${now().toFixed(0)} s` });
    await tapSel(sel); lastAct = Date.now(); continue;
  }
  if (await page.evaluate(() => !!document.querySelector(".moon") || !!document.querySelector(".again"))) { await page.waitForTimeout(3000); await observe(); await S.shot(page, { ecran: "fin", etat: `t = ${now().toFixed(0)} s : la lune, « Encore ! »` }); break; }
}
if (last) last.fin = now();
if (idleStart !== null) idle.push({ de: idleStart, a: now(), etape: prevEtape, dit: idleSaid });
const total = now();
// ---- la chronologie
const fmt = (x) => x.toFixed(1).replace(".", ",");
const cell = (x) => String(x ?? "").replace(/\|/g, "/");
const etapes = {}; for (const r of rows) etapes[r.etape] = (etapes[r.etape] ?? 0) + (r.fin - r.t);
const longs = idle.filter((x) => x.a - x.de >= 1.5);
const L = [`# Partie D · ${nom} : une séance à vitesse réelle`, "",
  `Voix réelle (fichiers Piper), base neuve (première séance : choix du nom de la pieuvre), réponse ${DELAI / 1000} s après pouvoir répondre ; outil \`tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas ${cas}\`, paramètre de l'application \`?${params}\`.`, "",
  `- **durée totale** : ${Math.floor(total / 60)} min ${Math.round(total % 60)} s (${fmt(total)} s)`,
  `- durée par étape : ${Object.entries(etapes).map(([k, v]) => `${k} ${fmt(v)} s`).join(" ; ")}`,
  `- **attentes sans rien à toucher** (hors réécouter, maison, espace parent) : ${idle.length} en tout, ${fmt(idle.reduce((a, x) => a + x.a - x.de, 0))} s cumulées ; ${longs.length} de 1,5 s ou plus (tableau plus bas)`,
  `- erreurs de page : ${s.errors.length ? [...new Set(s.errors)].join(" | ") : "aucune"}`, "",
  "## Chronologie", "", "Un moment = tant que l'étape, ce qui est affiché et ce qui est attendu de l'enfant ne changent pas (relevé toutes les 250 ms). « dit » : les phrases qui commencent pendant ce moment (relevées au quart de seconde près : une phrase dite juste au changement peut apparaître au moment suivant). Hors question, les bulles-réponses, le pavé, « je ne sais pas » et le coquillage (aide) restent affichés mais sont bloqués : ils ne sont pas comptés comme « à toucher ».", "",
  "| début (s) | durée (s) | étape | affiché | attendu de l'enfant | dit |", "| --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => `| ${fmt(r.t)} | ${fmt(r.fin - r.t)} | ${r.etape} | ${cell(r.affiche)} | ${cell(r.attendu)} | ${cell(r.dit.map((d) => `« ${d} »`).join(" "))} |`), "",
  "## Attentes sans rien à toucher (1,5 s ou plus)", "", "| de (s) | à (s) | durée (s) | étape | dit pendant l'attente |", "| --- | --- | --- | --- | --- |",
  ...longs.map((x) => `| ${fmt(x.de)} | ${fmt(x.a)} | ${fmt(x.a - x.de)} | ${x.etape ?? "—"} | ${cell(x.dit.map((d) => `« ${d} »`).join(" "))} |`), ""];
writeFileSync(join(DIR, `D-${cas}-chronologie.md`), L.join("\n"));
const pl = await S.planches(nav);
writeFileSync(join(DIR, `D-${cas}.json`), JSON.stringify({ cas, nom, total, etapes, idle: longs.length, idleS: idle.reduce((a, x) => a + x.a - x.de, 0), errors: s.errors, planches: pl }, null, 1));
console.log(`${nom} : ${fmt(total)} s, ${longs.length} attentes ≥ 1,5 s, planches ${pl.length}`);
await nav.close();
