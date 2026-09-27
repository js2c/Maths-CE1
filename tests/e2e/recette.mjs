// RECETTE « avec les yeux de l'enfant » : une première séance complète, voix à vitesse réelle, jouée comme
// une enfant qui répond --delai secondes (1,5 par défaut) après pouvoir répondre. Chronologie : ce que l'enfant peut faire à chaque
// instant (répondre, toucher une bulle, rien), captures à chaque changement d'écran, inventaire des
// éléments visibles qui ressemblent à des boutons et de leur réaction au toucher.
//   node tests/e2e/recette.mjs [--out dossier] [--delai secondes : temps de réponse de l'enfant, 1,5 par défaut] [--module 2 : notion du jour imposée (lot 2, étape 6)]
//     [--defi : une séance où le défi record a lieu (lot 2, étape 9) : 5 séances déjà terminées, la famille 1 connue (point de départ), la pieuvre déjà nommée]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/recette")); mkdirSync(OUT, { recursive: true });
const DELAI = Math.round(Number(opt("--delai", "1.5")) * 1000); // temps de réponse de l'enfant
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
let shots = 0; const shot = (n) => page.screenshot({ path: join(OUT, `${String(++shots).padStart(2, "0")}-${n}.png`) });
const T0 = Date.now(), tl = [], s = () => ((Date.now() - T0) / 1000).toFixed(1);
const note = (what) => { tl.push([+s(), what]); console.log(s(), what); };

// l'état vu par l'enfant
const state = () => page.evaluate(() => {
  const A = window.__app, vis = (e) => e && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).display !== "none" && e.offsetParent !== null;
  const f = A.facts, l = A.screen;
  const inputFacts = !!(f?.q && f.resolve && !f.locked), inputLine = !!(l?.q && l.resolve && !l.locked);
  const btns = [...document.querySelectorAll("#ui .bubble, #ui button")].filter(vis).map((b) => (b.className.split(" ").filter((c) => !["bubble", "pop", "keep"].includes(c)).join(".") || b.tagName) + (b.dataset.key ? `[${b.dataset.key}]` : ""));
  const huds = [...document.querySelectorAll("#ui .hud")].filter(vis).map((b) => b.className.replace("hud ", ""));
  return { etape: A.frieze?.p?.etape ?? null, inputFacts, inputLine, q: inputFacts ? `${f.q.a}+${f.q.b}` : inputLine ? `${l.q.format}:${l.q.answer}` : null, lesson: !!A.lessons?.keys?.length && A.lessons.p !== undefined, voix: A.voice.speaking, btns, huds, paused: document.getElementById("stage").classList.contains("paused") };
});
const tapSel = (sel) => page.tap(sel, { force: true }).catch(() => {});
const typeIn = async (n) => { for (const d of String(n)) await tapSel(`.key[data-key="${d}"]`); await tapSel('.key[data-key="valider"]'); };

if (args.includes("--defi")) {
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => {
    const s = window.__app.store; await s.setSetting("mascotte", "Pili");
    const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); await markFamilyKnown(s, m2, 1);
    const t = Date.now() - 12 * 86400000; for (let i = 0; i < 5; i++) await s.add("seances", { debut: t + i * 2 * 86400000, fin: t + i * 2 * 86400000 + 600000, dureeS: 600, terminee: true, module: (i % 2) + 1, questions: 30, justes: 25, reussite: 0.83, etoiles: 30, etapes: [] });
  });
}
await page.goto(url + `?nosw${opt("--module") ? `&module=${opt("--module")}` : ""}`); await page.waitForFunction(() => window.__ready !== undefined);
await shot("accueil"); note("accueil prêt");
const home = await state(); note(`accueil : boutons visibles ${home.btns.join(", ")} ; décors ${home.huds.join(", ")}`);
await tapSel(".play");
let last = "", nf = 0, nl = 0, idle = 0, lastAct = Date.now(), prevEtape = null;
const waits = []; let waitStart = Date.now();
const deadline = Date.now() + 16 * 60000;
while (Date.now() < deadline) {
  await page.waitForTimeout(250);
  const st = await state();
  if (st.etape !== prevEtape) { note(`--- étape ${st.etape}`); prevEtape = st.etape; await shot(`etape-${st.etape}`); }
  const sig = JSON.stringify([st.q, st.btns.filter((b) => !b.startsWith("key")).sort(), st.huds.sort()]);
  if (sig !== last) { note(`écran : question=${st.q ?? "-"} ; boutons=${st.btns.filter((b) => !b.startsWith("key")).join(",")} ; affichages=${st.huds.join(",")}${st.voix ? " ; voix" : ""}`); last = sig; }
  if (st.inputFacts || st.inputLine) {
    waits.push({ etape: st.etape, attenteS: (Date.now() - waitStart) / 1000, q: st.q });
    await page.waitForTimeout(DELAI);
    if (st.inputFacts) {
      // (la minute du défi peut finir pendant l'attente : la question disparaît)
      const q = await page.evaluate(() => { const f = window.__app.facts.q; return f ? (f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b) : null; });
      if (q === null) { waitStart = Date.now(); continue; }
      nf++;
      if (nf === 3) { note(`additions : « je ne sais pas » (${st.q})`); await tapSel(".facts .nsp, .nsp"); } else await typeIn(nf === 5 ? q + 1 : q);
      if (nf === 3) await shot("additions-nsp");
    } else {
      nl++; const q = await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer, g: !!window.__app.screen.q.guide }));
      if (nl === 1) await shot("ligne-premiere-question");
      if (nl === 4) { note(`ligne : « je ne sais pas » (${st.q})`); await tapSel(".nsp"); await page.waitForTimeout(1500); await shot("ligne-nsp-correction"); }
      else if (nl === 6) { const v = q.f === "lire" || q.f === "sauter" ? await page.evaluate(() => { const b = [...document.querySelectorAll(".answer")].find((x) => Number(x.dataset.value) !== window.__app.screen.q.answer); return b?.dataset.value; }) : null;
        note(`ligne : réponse fausse (${st.q}, donne ${v})`); if (v) await tapSel(`.answer[data-value="${v}"]`); else await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.answer + 3, null); }); await page.waitForTimeout(1500); await shot("ligne-erreur-correction"); }
      else if (q.f === "lire" || q.f === "sauter") await tapSel(`.answer[data-value="${q.a}"]`);
      else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
    }
    await page.waitForTimeout(400); waitStart = Date.now(); lastAct = Date.now(); continue;
  }
  // bulles à toucher hors questions : nom, coquillage, carte, « continuer »… (l'enfant attend 2 s)
  const inv = st.btns.find((b) => /name|shelltap|check|play/.test(b));
  if (inv && Date.now() - lastAct > 2000) { note(`toucher : ${inv}`); if (/name/.test(inv)) await shot("choix-nom"); if (/shelltap/.test(inv)) await shot("coquillage"); if (/check/.test(inv)) await shot("carte-ou-validation");
    await tapSel("." + inv.split(".")[0].split("[")[0]); lastAct = Date.now(); continue; }
  if (st.huds.includes("moon") || st.btns.some((b) => /encore/.test(b))) { note("fin : lune / Encore"); await page.waitForTimeout(3000); await shot("fin"); break; }
}
// inventaire après la séance : tout ce qui est visible et réagit ou non au toucher
const fin = await state(); note(`fin : boutons ${fin.btns.join(", ")} ; décors ${fin.huds.join(", ")}`);
note(`durée totale : ${s()} s`);
writeFileSync(join(OUT, "chronologie.json"), JSON.stringify({ tl, waits, errors }, null, 1));
console.log("erreurs console :", errors.length ? errors : "aucune");
await browser.close(); srv.close();
